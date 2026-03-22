# 06_DEPENDENCY_MANIFEST

## Purpose

List the exact upstream artifacts and prerequisites the mission depends on so nobody builds on fog.

## Required artifacts

- `docs/cyborgclaw/SSOT.md`
- `docs/web/control-ui.md`
- `src/commands/dashboard.ts`
- `src/gateway/control-ui-contract.ts`
- `ops/missions/openclaw-governance/continuity-system-v1/CURRENT_LANE_BRIEFING.md`
- `/home/spryguy/.openclaw/workspace-voltaris-v2/ops/templates/dev-pack-v1/`

## Required decisions

- `Keep this lane planning-only and artifact-only.`
- `Treat missing Workforce Alpha V1 tracked surfaces as TO VERIFY / UNCONFIRMED instead of inventing them.`

## Required runtime proofs

- `repo root, branch, and SHA proof for /home/spryguy/openclaw-workspace/repos/openclaw`
- `tracked-artefact reconnaissance proving what Workforce Alpha evidence is or is not present in the repo`

## Required services / auth state

- `local filesystem access to the repo`
- `local filesystem access to the shared template source`
- `no external auth required`

## Dependency gate result

- VERIFIED PRESENT:
- `docs/cyborgclaw/SSOT.md`
- `docs/web/control-ui.md`
- `src/commands/dashboard.ts`
- `src/gateway/control-ui-contract.ts`
- `ops/missions/openclaw-governance/continuity-system-v1/CURRENT_LANE_BRIEFING.md`
- `shared dev-pack-v1 template source`
- MISSING:
- `repo-local ops/templates/dev-pack-v1/`
- DEGRADED:
- `a clearly named Workforce Alpha V1 page surface is not yet proven in tracked repo artifacts`
- DECISION:
- `Proceed with pack initialization and section A critique while keeping unproven V1 surfaces explicitly TO VERIFY / UNCONFIRMED.`

## Rule

If a dependency is mission-critical and missing, the mission starts RED.
