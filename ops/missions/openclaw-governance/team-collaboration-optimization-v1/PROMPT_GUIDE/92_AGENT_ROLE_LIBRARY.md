# Optional Agent Role Library

This file is optional and future-facing.

## Suggested starter roles

### explorer

Purpose:

- map execution paths
- find relevant files
- summarize touched modules

Default stance:

- read-only

### reviewer

Purpose:

- inspect diffs
- identify risks
- flag hidden scope drift

Default stance:

- read-only

### docs_researcher

Purpose:

- verify API / docs / contract details
- cross-check assumptions against official docs

Default stance:

- read-only

## Rollout note

Do not make project-scoped custom agent roles mandatory until the team is ready to standardize `.codex/agents/` usage.
