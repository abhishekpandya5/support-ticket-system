# Tool Workflow — Cursor

**Deep reference:** [`tool-specific/cursor-workflow/project-context.md`](tool-specific/cursor-workflow/project-context.md)

## Before Implementing

1. Provide context — `@requirements-analysis.md`, `@design-notes.md`, `@api-contract.md`
2. State Core vs Stretch scope
3. Name stack constraints and acceptance criteria

## AI Should

| Activity | Approach |
|----------|----------|
| Planning | Tasks with requirement traceability |
| Implementation | Focused diffs; layered backend |
| Testing | State machine integration tests first |
| Debugging | Root-cause fixes with evidence |
| Documentation | Keep README and artifacts in sync |

## AI Must Not

- Skip backend validation
- Enforce state machine only in frontend
- Commit secrets
- Overwrite prompt history — append to `ai-prompts/*.md` only

## Prompt History

| Activity | File |
|----------|------|
| Planning | `ai-prompts/planning.md` |
| Design | `ai-prompts/design.md` |
| Implementation | `ai-prompts/implementation.md` |
| Testing | `ai-prompts/testing.md` |
| Debugging | `ai-prompts/debugging.md` |
| Code review | `ai-prompts/code-review.md` |
| Documentation | `ai-prompts/documentation.md` |

See `.cursor/rules/prompt-history-logging.mdc`.

*Migrated from `project-context.md` §§9–11 on 2026-07-18.*
