import { useState } from "react";

const TEMPLATES: Record<string, { label: string; content: string }> = {
  "adr/": {
    label: "ADR Template",
    content: `---
title: "ADR-XX: Decision Title"
status: Proposed
date: ${new Date().toISOString().split("T")[0]}
scope: system
---

# ADR-XX: Decision Title

## Context

{What is the issue or problem that motivates this decision?}

## Decision

{What is the change that we're proposing and/or doing?}

## Alternatives Considered

| Option | Pros | Cons |
|--------|------|------|
| Option A | ... | ... |
| Option B | ... | ... |

## Consequences

{What becomes easier or more difficult to do because of this change?}
`,
  },
  "fdr/": {
    label: "FDR Template",
    content: `---
title: "FDR-XX: Feature Title"
status: In Progress
date: ${new Date().toISOString().split("T")[0]}
scope: backend
---

# FDR-XX: Feature Title

## Overview

{What feature is being developed and why?}

## Edge Cases

| ID | Category | Description | Handling |
|----|----------|-------------|----------|
| E1 | Input | ... | ... |

## Risk Assessment

| ID | Risk | Likelihood | Impact | Mitigation |
|----|------|-----------|--------|-----------|
| R1 | ... | Medium | High | ... |

## Testing Strategy

{How will this feature be tested?}
`,
  },
  "implementation_plans/": {
    label: "IMPL Template",
    content: `---
title: "IMPL-XX: Plan Title"
date: ${new Date().toISOString().split("T")[0]}
method: pragmatic
source: FDR-XX
---

# IMPL-XX: Plan Title

## Tasks

| ID | Title | Status | Dependencies | Track |
|----|-------|--------|-------------|-------|
| T01 | ... | pending | - | core |
| T02 | ... | pending | T01 | core |
`,
  },
  "knowledge/patterns/": {
    label: "Pattern Template",
    content: `---
title: "Pattern: Name"
type: pattern
tags: []
created: ${new Date().toISOString().split("T")[0]}
---

# Pattern: Name

## Context

{When does this pattern apply?}

## Solution

{What is the approach?}

## Examples

{Code or references}
`,
  },
  "knowledge/lessons/": {
    label: "Lesson Template",
    content: `---
title: "Lesson: Name"
type: lesson
tags: []
created: ${new Date().toISOString().split("T")[0]}
---

# Lesson: Name

## What Happened

{Describe the situation}

## What We Learned

{Key takeaway}

## How to Apply

{Guidance for future work}
`,
  },
};

interface TemplateToolbarProps {
  currentDir: string;
  onInsert: (content: string) => void;
}

export function TemplateToolbar({ currentDir, onInsert }: TemplateToolbarProps) {
  const [open, setOpen] = useState(false);

  const matchingTemplates = Object.entries(TEMPLATES).filter(([prefix]) =>
    currentDir.includes(prefix.replace("/", ""))
  );

  if (matchingTemplates.length === 0) return null;

  return (
    <div style={{ position: "relative", display: "inline-block" }}>
      <button
        onClick={() => setOpen(!open)}
        style={{
          padding: "3px 10px",
          background: "var(--bg-tertiary)",
          color: "var(--text-secondary)",
          border: "1px solid var(--border)",
          borderRadius: "var(--radius)",
          cursor: "pointer",
          fontSize: 11,
        }}
      >
        + Template
      </button>
      {open && (
        <div
          style={{
            position: "absolute",
            top: "100%",
            left: 0,
            marginTop: 4,
            background: "var(--bg-secondary)",
            border: "1px solid var(--border)",
            borderRadius: "var(--radius)",
            zIndex: 100,
            minWidth: 160,
            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
          }}
        >
          {matchingTemplates.map(([prefix, tmpl]) => (
            <button
              key={prefix}
              onClick={() => {
                onInsert(tmpl.content);
                setOpen(false);
              }}
              style={{
                display: "block",
                width: "100%",
                padding: "6px 12px",
                background: "transparent",
                border: "none",
                color: "var(--text-primary)",
                cursor: "pointer",
                fontSize: 11,
                textAlign: "left",
              }}
              onMouseEnter={(e) => { e.currentTarget.style.background = "var(--bg-tertiary)"; }}
              onMouseLeave={(e) => { e.currentTarget.style.background = "transparent"; }}
            >
              {tmpl.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
