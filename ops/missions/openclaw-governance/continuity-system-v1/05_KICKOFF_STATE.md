# 05_KICKOFF_STATE

## Purpose

Capture the exact inherited startup truth so the next operator begins from reality, not memory.

## Mission identity

- Mission ID: `openclaw-governance/continuity-system-v1`
- Mission name: `Continuity System V1 Governance`
- Mode: `extended`

## Runtime cockpit

- Host: `voltaris`
- Workspace path: `/home/spryguy/openclaw-workspace`
- Repo path: `/home/spryguy/openclaw-workspace/repos/openclaw`
- Expected repo root: `/home/spryguy/openclaw-workspace/repos/openclaw`
- Branch / worktree expectation: `stay on the current working branch unless explicitly directed otherwise`
- Last known good SHA: `bd22e71c9e36806edd9c01a5d53ac3859e8f289e`

## Inherited state

- Prior mission(s): `Continuity lessons and rehydration failures were surfaced during the Mission 2 / Voltaris-Codex operating loop.`
- Expected dependency artifacts: `shared dev-pack-v1 template source, repo-local ops/ tree, AGENTS.md`
- Known critical paths: `ops/missions/openclaw-governance/continuity-system-v1/`, `ops/`, `AGENTS.md`
- Known touched surfaces: `ops/missions/ only for this lane`
- Known risks at open: `repo-local ops/templates/dev-pack-v1 is missing; repo is not on the requested baseline branch; a pre-existing untracked ops/missions/cnv-mission-2-mission-control-ui/ path exists and must remain untouched`

## Must-win objective for first session

`Instantiate the continuity pack, replace template placeholders in mission truth, and scaffold the starter continuity artifacts without touching product code.`

## PASS means

- repo truth is proven
- primary build surface is identified
- one bounded next action can be chosen honestly

## FAIL means

- wrong repo
- unsafe branch/tree state
- mission-critical dependency missing
