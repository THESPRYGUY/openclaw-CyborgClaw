# Voltaris V2

This pack is the first-pass scaffold for Voltaris V2 as a governed master genome
for CyborgClaw.

It is intentionally shaped to fit the repo's existing realities:

- Gateway remains the authority for sessions, routing, channel state, and
  control-plane truth.
- The runtime consumes workspace bootstrap files and frozen manifests.
- The genome compiler is a factory layer, not a replacement runtime.
- Governance overlays constrain deployment and mutation without stealing live
  session truth from Gateway.

## 1. Executive architecture summary

Voltaris V2 is defined here as a canonical source genome plus a deterministic
compiled pack. The genome expresses identity, charter, authority, tool posture,
memory law, runtime assumptions, provider policy, clone rules, mutation rules,
and benchmark gates. The compiled pack renders that genome into the exact
OpenClaw workspace bootstrap files the runtime already knows how to load, plus
frozen lineage/runtime/policy manifests and deterministic receipts.

The design studio role is narrow on purpose: resolve the genome, render the
artifacts, validate them, snapshot them, and hand the pack to deployment
bridges. It does not become the runtime, and it does not own live sessions.

## 2. Voltaris V2 master genome design

- Canonical genome schema: `schemas/agent.genome.v1.schema.json`
- Genome instance: `voltaris-v2.genome.yaml`
- Canonical lineage id: `lineage.cyborgclaw.voltaris-v2.master`
- Canonical agent id: `voltaris-v2`
- Runtime posture: embedded OpenClaw runtime, with ACP allowed only as a
  Gateway bridge
- Governance posture: critical-risk, dual-control for runtime, policy, and
  deployment-affecting changes

## 3. Canonical agent-genome.v1 schema

The schema freezes these domains:

- identity
- mission
- authority
- tools
- memory
- bootstrap contract
- runtime contract
- provider policy
- governance metadata
- telemetry hooks
- clone rules
- mutation rules
- validation suite
- deterministic build contract

This keeps the master genome focused on governable truth rather than ad hoc
prompt prose.

## 4. Voltaris V2 compiled artifact map

Compiled workspace files:

- `compiled/workspace/IDENTITY.md`
- `compiled/workspace/SOUL.md`
- `compiled/workspace/AGENTS.md`
- `compiled/workspace/TOOLS.md`
- `compiled/workspace/USER.md`

Frozen manifests:

- `compiled/manifests/agent.lineage.json`
- `compiled/manifests/agent.runtime.json`
- `compiled/manifests/agent.policy.json`
- `compiled/manifests/deployment.manifest.json`

Packaging and proof artifacts:

- `compiled/package.manifest.json`
- `compiled/build.receipt.json`

## 5. Validation and approval model

Validation layers:

- genome schema validation against `schemas/agent.genome.v1.schema.json`
- frozen manifest validation against the existing M11 schemas
- build receipt digest parity checks
- package-manifest coverage checks
- readiness benchmark assertions

Canonical manifest digests in this scaffold are computed on a normalized JSON
form that zeroes every digest-bearing field before hashing. That breaks
otherwise-cyclic runtime/policy digest references while leaving the build
receipt to carry byte-level file integrity.

Approval posture:

- low-risk wording changes: owner
- medium-risk capability changes: owner plus runtime steward
- high-risk charter/authority/runtime changes: owner plus governance steward
  plus security reviewer
- forbidden mutations: reject before compile

## 6. Clone model

Supported clone types:

- exact clone
- identity clone
- capability clone
- mission clone
- lane-specific clone

Each clone type is defined in the genome with:

- what may change
- what must remain inherited
- who must approve it
- which tests rerun
- what lineage record must be written

## 7. Mutation model

Mutation classes:

- low-risk
- medium-risk
- high-risk
- forbidden

Each class carries:

- allowed surfaces
- reviewer set
- validation steps
- rollback rule
- semantic diff expectation
- lineage update requirement

## 8. OpenClaw/CyborgClaw runtime integration model

Compiler ownership:

- resolve inheritance
- render workspace files
- generate manifests
- emit receipts

Runtime ownership:

- execute under the compiled workspace and tool policy
- honor sandbox and tool constraints
- write session-local artifacts only where runtime already owns them

Gateway ownership:

- session keys
- routing
- channel state
- approvals
- live control-plane truth

Governance overlay ownership:

- approval receipts
- mutation authorization
- deployment gates

## 9. Repo/folder layout

Scaffold shipped in this pass:

- `schemas/agent.genome.v1.schema.json`
- `examples/voltaris-v2-pack/voltaris-v2.genome.yaml`
- `examples/voltaris-v2-pack/compiled/**`
- `scripts/cyborgclaw/validate-voltaris-v2-pack.ts`
- `test/voltaris-v2-pack-proof.test.ts`

Recommended next implementation layout once this moves beyond the example-pack
phase:

- `src/cyborgclaw/genome/schema.ts`
- `src/cyborgclaw/genome/compile.ts`
- `src/cyborgclaw/genome/renderers/*.ts`
- `src/cyborgclaw/genome/validation/*.ts`
- `src/cyborgclaw/genome/lineage/*.ts`
- `src/cyborgclaw/genome/deploy/*.ts`

## 10. First 10 files to create

The first 10 implementation files should be:

1. `schemas/agent.genome.v1.schema.json`
2. `examples/voltaris-v2-pack/voltaris-v2.genome.yaml`
3. `examples/voltaris-v2-pack/compiled/workspace/IDENTITY.md`
4. `examples/voltaris-v2-pack/compiled/workspace/SOUL.md`
5. `examples/voltaris-v2-pack/compiled/workspace/AGENTS.md`
6. `examples/voltaris-v2-pack/compiled/workspace/TOOLS.md`
7. `examples/voltaris-v2-pack/compiled/workspace/USER.md`
8. `examples/voltaris-v2-pack/compiled/manifests/agent.lineage.json`
9. `examples/voltaris-v2-pack/compiled/manifests/agent.runtime.json`
10. `examples/voltaris-v2-pack/compiled/manifests/agent.policy.json`

## 11. First implementation milestone plan

Milestone 1 in this scaffold is "trust the pack":

- validate the genome
- validate the frozen manifests
- verify self-digest and cross-digest rules
- verify package coverage
- verify build receipt parity

Milestone 2 should be "compile from source":

- render workspace files from the genome rather than storing hand-authored
  examples
- synthesize manifest digests automatically
- emit golden snapshots and diffs

Milestone 3 should be "deploy bridge":

- wire pack admission into a real CyborgClaw registry or deployment path
- bind approved packs to OpenClaw agent configuration without violating Gateway
  authority

## 12. Risks and drift watchpoints

- Drift risk: the example pack can diverge from a future real compiler if manual
  edits bypass receipt regeneration.
- Authority risk: a future studio or UI may try to smuggle runtime truth outside
  the frozen manifests.
- Mutation risk: descendant authors may request "small" changes that are really
  authority or governance mutations.
- Storage risk: governance overlay persistence is still UNKNOWN in this repo.

## 13. Recommended next action

Implement the real compiler boundary under `src/cyborgclaw/genome/` using this
pack as the golden fixture, and keep this example pack in CI as the canonical
drift detector.

## Unknowns to inspect next

- UNKNOWN: there is no repo-local CyborgClaw registry publication API yet.
- UNKNOWN: there is no established production path for governance overlay
  storage beyond frozen manifests and receipts.
- UNKNOWN: there is no existing `src/cyborgclaw/` runtime/compiler module tree,
  so the final internal location should be decided before milestone 2.
