#!/bin/bash
# Fire-and-forget: POST hook event to UI dashboard server
# Usage: echo "$hook_json" | ui-event-emitter.sh <event_type>
# Exits immediately if UI server not running (no .ui-port file)
# Zero overhead when UI is off.

set -euo pipefail

input=$(cat)
cwd=$(echo "$input" | jq -r '.cwd // empty')
[ -z "$cwd" ] && { echo '{}'; exit 0; }

port_file="$cwd/.claude/.ui-port"
[ -f "$port_file" ] || { echo '{}'; exit 0; }
port=$(cat "$port_file")
[ -z "$port" ] && { echo '{}'; exit 0; }

event_type="${1:-unknown}"
ts=$(date -u '+%Y-%m-%dT%H:%M:%S.%3NZ')

# Build event payload — pass through full hook input as data
payload=$(echo "$input" | jq -c \
  --arg type "$event_type" \
  --arg ts "$ts" \
  '{
    type: $type,
    ts: $ts,
    tool: (.tool_name // null),
    input: (.tool_input // null),
    output: (.tool_result // null),
    signal: (.signal // null),
    message: (.user_prompt // .message // null),
    blocked: (.blocked // false),
    meta: {
      hook_event: $type,
      session_id: (.session_id // null),
      cwd: (.cwd // null)
    }
  }')

# Fire and forget — don't block the hook
curl -s -X POST "http://127.0.0.1:$port/api/events" \
  -H 'Content-Type: application/json' \
  -d "$payload" --max-time 1 &>/dev/null &

echo '{}'
exit 0
