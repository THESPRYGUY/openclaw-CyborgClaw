# Mission 015 Handover

Status:

- concluded `GO`

Selected focus:

- fix the local-memory packaging/runtime reproducibility seam exposed by
  Mission 014

Why this packet was selected:

- Mission 014 proved OpenClaw `2026.4.5` can run here
- Mission 014 also proved the upgrade was only `HOLD`
- the exact blocker was bounded and known:
  - npm-installed local memory depended on hidden `node-llama-cpp` repair

What this mission should not become:

- a broad memory redesign
- a dreaming feature sprint
- a proxy for Mission 013 hardening

Closeout expectation:

- one reproducible package contract
- one release guard
- one truthful operator guidance path
- one reevaluation path back into Mission 014 / upgrade readiness

## Actual closeout

Mission 015 closed with a unanimous `GO` vote.

What changed:

- `node-llama-cpp` moved from `peerDependencies` to `optionalDependencies`
- `scripts/release-check.ts` now fails if that contract drifts
- local-memory guidance in the runtime and docs now matches the real npm /
  installer behavior

Clean proof:

- isolated npm install in `/tmp/tmp.MSNBPVP6zY`
- `node_modules/node-llama-cpp` present
- `node_modules/@node-llama-cpp/linux-x64` present
- bare `import("node-llama-cpp")` succeeded with `getLlama` available

Three-way vote:

- mission lead: `GO`
- real `codex`: `GO`
- real `voltaris-v2`: `GO`

Why:

- the local-memory packaging seam is now proven reproducible on a clean install
  path
- the remaining TypeScript build failures are pre-existing seams outside this
  packet

Next action:

- rerun the Mission 014 upgrade-readiness vote with the packaging blocker removed
- keep unrelated TypeScript failures explicitly out of scope for that vote
