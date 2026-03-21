# 06_DEPENDENCY_MANIFEST

## Purpose

List the exact upstream artifacts and prerequisites the mission depends on so nobody builds on fog.

## Required artifacts

- `/home/spryguy/.openclaw/workspace-voltaris-v2/ops/templates/dev-pack-v1/`
- `AGENTS.md`
- `ops/`

## Required decisions

- `Continuity work lives in a dedicated governing pack rather than inside a product-specific mission pack.`
- `Continuity System V1 stays file-backed in this lane.`

## Required runtime proofs

- `Repo root, branch, SHA, and remote proof for the openclaw repo`
- `Proof that the shared dev-pack-v1 template source is available`

## Required services / auth state

- `Local filesystem access to the repo and shared workspace`
- `No external authentication required`

## Dependency gate result

- VERIFIED PRESENT: `AGENTS.md`, repo-local ops/, shared dev-pack-v1 template source, package.json, README.md`
- MISSING: `repo-local ops/templates/dev-pack-v1/`
- DEGRADED: `The working branch is m20-trust-the-refusal-closeout instead of the requested main baseline`
- DECISION: `Proceed on the current branch without switching and use the shared template source for pack initialization`

## Rule

If a dependency is mission-critical and missing, the mission starts RED.
