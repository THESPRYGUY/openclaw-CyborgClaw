# Mission 015 Receipt Bundle - 2026-04-07T01:26:11Z

Outcome:

- `GO` for the local-memory packaging reproducibility seam

## What changed

- `package.json` now carries `node-llama-cpp` in `optionalDependencies`
- `scripts/release-check.ts` now fails if `node-llama-cpp` is missing from
  `optionalDependencies` or still present in `peerDependencies`
- runtime/install docs now say npm / installer should restore the local-memory
  runtime
- the local-memory error message now matches that contract

## Targeted proof

- `pnpm test -- src/memory/embeddings.test.ts` -> passed

## Clean install-path proof

Temp proof directory:

- `/tmp/tmp.MSNBPVP6zY`

Steps:

1. create a minimal package with:
   - `optionalDependencies.node-llama-cpp = 3.15.1`
2. run `npm install --omit=dev`
3. verify installed modules
4. verify bare import

Observed results:

- `node_modules/node-llama-cpp` present
- `node_modules/@node-llama-cpp/linux-x64` present
- other linux variants also present
- `import("node-llama-cpp")` succeeded
- `getLlama` available

## Build note

- full `pnpm build` remains red, but only on unrelated pre-existing TypeScript
  errors:
  - `src/agents/anthropic-payload-log.ts`
  - `src/agents/pi-embedded-runner/extra-params.ts`
- these failures were kept explicitly out of scope for Mission 015

## Three-way vote

### Mission lead

- `GO`

Reason:

- the clean install proof closes the exact packaging seam exposed by Mission 014

### Real `codex`

- `GO`

Reason:

- the local-embeddings packaging path is now proven reproducible in a clean
  install flow

### Real `voltaris-v2`

- `GO`

Reason:

- the operator story is now supportable for the packaging seam, and the
  remaining build failures are unrelated

## Converged result

Unanimous outcome:

- `GO`

Next action:

- rerun Mission 014 upgrade-readiness closeout with the packaging blocker removed
