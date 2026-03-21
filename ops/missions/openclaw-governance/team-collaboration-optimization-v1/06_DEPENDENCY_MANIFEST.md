# 06_DEPENDENCY_MANIFEST

## Purpose

List the exact upstream artifacts and prerequisites the mission depends on so nobody builds on fog.

## Required artifacts

- `ops/missions/openclaw-governance/continuity-system-v1/FINAL_MISSION_COMPLETION_REPORT.md`
- `ops/missions/openclaw-governance/continuity-system-v1/CURRENT_LANE_BRIEFING.md`
- `ops/missions/openclaw-governance/continuity-system-v1/PROMOTION_RULES.md`
- `/home/spryguy/.openclaw/workspace-voltaris-v2/ops/templates/dev-pack-v1/`

## Required decisions

- `service-abstraction scope remains deferred and out of scope for this mission`
- `collaboration learnings become shared truth only through governed, receipt-backed promotion`

## Required runtime proofs

- `repo root and branch state proven before mutation`
- `archived continuity pack readable as governance baseline`

## Required services / auth state

- `local filesystem access to the repo`
- `no external auth required for this planning lane`

## Dependency gate result

- VERIFIED PRESENT:
- `archived continuity mission artifacts are present`
- `shared template source is present`
- MISSING:
- `repo-local ops/templates/dev-pack-v1/`
- DEGRADED:
- `none blocking for planning-only work`
- DECISION:
- `proceed with planning-only pack initialization using the shared template source`

## Rule

If a dependency is mission-critical and missing, the mission starts RED.
