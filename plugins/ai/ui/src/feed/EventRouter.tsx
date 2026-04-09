import type { SessionEvent } from "../hooks/useEventStream";
import { UserPrompt } from "./widgets/UserPrompt";
import { SessionEventWidget } from "./widgets/SessionEvent";
import { BashCommand } from "./widgets/BashCommand";
import { CodeDiff } from "./widgets/CodeDiff";
import { FileCreate } from "./widgets/FileCreate";
import { FileRead } from "./widgets/FileRead";
import { SearchResult } from "./widgets/SearchResult";
import { AgentStart } from "./widgets/AgentStart";
import { AgentResult } from "./widgets/AgentResult";
import { JobStatus } from "./widgets/JobStatus";
import { QuestionWidget } from "./widgets/QuestionWidget";
import { GenericEvent } from "./widgets/GenericEvent";

interface EventRouterProps {
  event: SessionEvent;
}

export function EventRouter({ event }: EventRouterProps) {
  // User prompt
  if (event.type === "user_prompt") {
    return <UserPrompt event={event} />;
  }

  // Session lifecycle
  if (event.type === "session_start" || event.type === "session_end" || event.type === "stop_requested") {
    return <SessionEventWidget event={event} />;
  }

  // Stop blocked (lint/review gate)
  if (event.type === "stop_blocked") {
    return <SessionEventWidget event={event} />;
  }

  // Job updates
  if (event.type === "job_update") {
    return <JobStatus event={event} />;
  }

  // Agent lifecycle
  if (event.type === "agent_start" || (event.type === "tool_call" && event.tool === "Agent")) {
    return <AgentStart event={event} />;
  }
  if (event.type === "agent_stop") {
    return <AgentResult event={event} />;
  }

  // Tool-specific widgets
  if (event.tool === "Bash") {
    return <BashCommand event={event} />;
  }
  if (event.tool === "Edit" || event.tool === "MultiEdit") {
    return <CodeDiff event={event} />;
  }
  if (event.tool === "Write") {
    return <FileCreate event={event} />;
  }
  if (event.tool === "Read") {
    return <FileRead event={event} />;
  }
  if (event.tool === "Grep" || event.tool === "Glob") {
    return <SearchResult event={event} />;
  }
  if (event.tool === "AskUserQuestion") {
    return <QuestionWidget event={event} />;
  }

  // Fallback
  return <GenericEvent event={event} />;
}
