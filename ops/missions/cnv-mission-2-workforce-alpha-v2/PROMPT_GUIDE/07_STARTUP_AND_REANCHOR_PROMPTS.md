# 07 — Startup and Re-anchor Prompts

## Fresh mission startup

```text
You are operating inside [MISSION NAME].
Read `AGENTS.md`, `MISSION_PACK.md`, `HANDOFF.md`, and the relevant files in `PROMPT_GUIDE/` first.

Startup task:
1. verify current mission context
2. verify branch / SHA / worktree state if relevant
3. restate the current mission objective in one paragraph
4. identify the correct execution route for the next step
5. propose the exact next promptable milestone

Do not mutate anything during startup unless explicitly told.
```

## Re-anchor a noisy session

```text
Re-anchor this session for [MISSION NAME].
Read `AGENTS.md`, `MISSION_PACK.md`, and `HANDOFF.md` first.

Return:
1. current mission objective
2. proven current state
3. current blocker or next action boundary
4. recommended route: direct / plan-first / subagent-assisted / cloud-delegated
5. the exact next milestone prompt to run
```
