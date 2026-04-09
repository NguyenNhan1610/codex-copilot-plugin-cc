import { randomUUID } from "node:crypto";

// --- Event types ---

export type EventType =
  | "user_prompt"
  | "tool_call"
  | "tool_result"
  | "agent_start"
  | "agent_stop"
  | "stop_requested"
  | "stop_blocked"
  | "job_update"
  | "session_start"
  | "session_end";

export type ToolName =
  | "Bash"
  | "Edit"
  | "MultiEdit"
  | "Write"
  | "Read"
  | "Glob"
  | "Grep"
  | "Agent"
  | "WebSearch"
  | "WebFetch"
  | "AskUserQuestion"
  | "TaskCreate"
  | "TaskUpdate"
  | "TaskList"
  | "NotebookEdit"
  | string; // allow unknown tools

export type SignalTag =
  | "[NEW]"
  | "[REVISION]"
  | "[ACCEPTED]"
  | "[CONTINUE]"
  | "[QUESTION]"
  | "[INCOMPLETE]";

// --- Core event ---

export interface SessionEvent {
  id: string;
  ts: string;
  type: EventType;
  tool?: ToolName;
  input?: Record<string, unknown>;
  output?: Record<string, unknown>;
  signal?: SignalTag;
  blocked?: boolean;
  message?: string;
  meta?: Record<string, unknown>;
}

// --- Job state ---

export type JobStatus = "queued" | "running" | "completed" | "failed" | "cancelled";

export interface JobState {
  jobId: string;
  kind: string;
  status: JobStatus;
  phase: string;
  summary: string;
  elapsed: number;
  sessionId?: string;
  pid?: number;
}

// --- File tree ---

export interface FileEntry {
  name: string;
  type: "file" | "dir";
  path: string;
  size?: number;
  modified?: string;
  children?: FileEntry[];
}

// --- Helpers ---

export function createEvent(
  type: EventType,
  data: Partial<Omit<SessionEvent, "id" | "ts" | "type">> = {}
): SessionEvent {
  return {
    id: randomUUID(),
    ts: new Date().toISOString(),
    type,
    ...data,
  };
}

// Browser-safe version (no node:crypto)
export function createEventBrowser(
  type: EventType,
  data: Partial<Omit<SessionEvent, "id" | "ts" | "type">> = {}
): SessionEvent {
  return {
    id: crypto.randomUUID(),
    ts: new Date().toISOString(),
    type,
    ...data,
  };
}
