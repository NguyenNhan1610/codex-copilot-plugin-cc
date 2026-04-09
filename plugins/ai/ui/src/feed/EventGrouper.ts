import type { SessionEvent } from "../hooks/useEventStream";

export interface GroupedEvent {
  type: "single" | "read_group" | "search_group" | "tool_pair";
  events: SessionEvent[];
  label?: string;
}

/**
 * Groups raw events to reduce visual noise:
 * 1. Consecutive Read events → single "Read N files" group
 * 2. Consecutive Grep/Glob events → "Searched N patterns" group
 * 3. tool_call + tool_result for same tool within 30s → paired widget
 */
export function groupEvents(events: SessionEvent[]): GroupedEvent[] {
  const groups: GroupedEvent[] = [];
  let i = 0;

  while (i < events.length) {
    const event = events[i];

    // Group consecutive Read events (3+)
    if (isReadEvent(event)) {
      const readBatch = collectConsecutive(events, i, isReadEvent);
      if (readBatch.length >= 3) {
        groups.push({
          type: "read_group",
          events: readBatch,
          label: `Read ${readBatch.length} files`,
        });
        i += readBatch.length;
        continue;
      }
    }

    // Group consecutive search events (3+)
    if (isSearchEvent(event)) {
      const searchBatch = collectConsecutive(events, i, isSearchEvent);
      if (searchBatch.length >= 3) {
        groups.push({
          type: "search_group",
          events: searchBatch,
          label: `Searched ${searchBatch.length} patterns`,
        });
        i += searchBatch.length;
        continue;
      }
    }

    // Pair tool_call with its tool_result
    if (event.type === "tool_call" && event.tool) {
      const resultIdx = findMatchingResult(events, i);
      if (resultIdx !== -1) {
        // Skip the tool_call, the result widget will render both states
        i++;
        continue;
      }
    }

    // Single event
    groups.push({ type: "single", events: [event] });
    i++;
  }

  return groups;
}

function isReadEvent(e: SessionEvent): boolean {
  return e.tool === "Read";
}

function isSearchEvent(e: SessionEvent): boolean {
  return e.tool === "Grep" || e.tool === "Glob";
}

function collectConsecutive(
  events: SessionEvent[],
  start: number,
  predicate: (e: SessionEvent) => boolean
): SessionEvent[] {
  const batch: SessionEvent[] = [];
  for (let j = start; j < events.length; j++) {
    if (predicate(events[j])) {
      batch.push(events[j]);
    } else {
      break;
    }
  }
  return batch;
}

function findMatchingResult(events: SessionEvent[], callIdx: number): number {
  const call = events[callIdx];
  const callTs = new Date(call.ts).getTime();

  // Look ahead up to 20 events or 30 seconds
  for (let j = callIdx + 1; j < Math.min(callIdx + 20, events.length); j++) {
    const candidate = events[j];
    if (
      candidate.type === "tool_result" &&
      candidate.tool === call.tool &&
      Math.abs(new Date(candidate.ts).getTime() - callTs) < 30000
    ) {
      return j;
    }
  }
  return -1;
}
