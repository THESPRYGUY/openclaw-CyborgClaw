# Mission 008 — Run Receipt Bundle

Run ID: `20260405_023225Z`
Mission: `MISSION-008`
Status: `runtime implementation in progress`
Implementation job: `job-66BHu_h1Xd`

## Executive summary

This run converted Mission 008 from a paper packet into a real implementation mission with honest runtime evidence.

Three important things are now proven:

- bounded one-shot Alpha subagent spawning works live when the controller uses `mode="run"` without thread binding
- out-of-contract cross-agent spawning is denied live with a visible reason
- max-depth and max-children stop rails are covered directly in the runtime test suite

This run does **not** claim the mission is sealed. The delegation contract still needs final admission, and publish / closeout remain ahead.

## Runtime guardrail patch

Scoped changes in this run:

- `src/agents/subagent-spawn.ts`
- `src/agents/system-prompt.ts`
- `src/agents/tools/sessions-spawn-tool.ts`
- `src/agents/system-prompt.test.ts`
- `src/agents/sessions-spawn-hooks.test.ts`

What changed:

- thread-binding failures now tell the agent/operator what to do next instead of just failing opaquely
- the system prompt now explicitly says to prefer `sessions_spawn` with `mode: "run"` for one-shot bounded work
- the `sessions_spawn` tool description now makes thread-bound `mode: "session"` clearly channel-dependent
- regression coverage now checks that the runtime suggests `mode="run"` when thread-binding hooks are unavailable

## Live proof 001 — positive path

Objective:

- prove that `president-a` can launch exactly one bounded Alpha subagent and receive a completion receipt

Requester session:

- `agent:president-a:main`

Prompt requirements used:

- `runtime: "subagent"`
- `mode: "run"`
- `thread: false`
- child task: `reply with ALPHA_CHILD_OK only`

Accepted spawn receipt:

- status: `accepted`
- run id: `cfc67611-9244-4f9a-9682-075830841088`
- child session key: `agent:president-a:subagent:e28970e4-0667-4df4-8b2d-42120f886d40`
- model applied: `true`

Completion receipt:

- `{"spawnStatus":"accepted","runId":"cfc67611-9244-4f9a-9682-075830841088","childSessionKey":"agent:president-a:subagent:e28970e4-0667-4df4-8b2d-42120f886d40","childResult":"ALPHA_CHILD_OK"}`

Interpretation:

- the bounded one-shot spawn path works live
- the child completion announcement reaches the requester cleanly
- this is the first real positive-path Mission 008 proof

## Live proof 002 — denial path

Objective:

- prove that an out-of-contract cross-agent spawn attempt is denied visibly

Requester session:

- `agent:president-a:main`

Prompt requirements used:

- `runtime: "subagent"`
- `mode: "run"`
- `thread: false`
- `agentId: "voltaris-v2"`
- child task: `reply with SHOULD_NOT_RUN only`

Returned denial receipt:

- `{"spawnStatus":"forbidden","error":"agentId is not allowed for sessions_spawn (allowed: none)","childSessionKey":null}`

Interpretation:

- cross-agent spawning is not silently admitted
- the runtime emits a visible denial reason instead of pretending the attempt succeeded

## Direct proof 003 — stop-condition rails

Objective:

- prove that depth and fanout guardrails exist and deny out-of-bounds spawning

Evidence:

- default runtime depth rail in `src/config/agent-limits.ts`: `DEFAULT_SUBAGENT_MAX_SPAWN_DEPTH = 1`
- direct runtime tests in `src/agents/openclaw-tools.subagents.sessions-spawn-depth-limits.test.ts`

Command:

```bash
pnpm test -- src/agents/openclaw-tools.subagents.sessions-spawn-depth-limits.test.ts
```

Result:

- `1` file passed
- `8` tests passed

What this covers:

- deny when caller depth reaches `maxSpawnDepth`
- allow depth-1 callers only when config opts into deeper nesting
- deny once active children reach `maxChildrenPerAgent`

Interpretation:

- Mission 008 now has direct stop-condition evidence for depth and fanout rails
- this proof is test-backed, not yet a separate live multi-depth canary

## Focused validation

Commands run:

```bash
pnpm test -- src/agents/system-prompt.test.ts src/agents/sessions-spawn-hooks.test.ts src/agents/tools/sessions-spawn-tool.test.ts
pnpm test -- src/agents/openclaw-tools.subagents.sessions-spawn-depth-limits.test.ts
```

Results:

- prompt/tool/hook regression set: passed
- depth/fanout guardrail set: passed

Build status:

- `pnpm build` did **not** pass end-to-end in this repo state
- observed failures were outside the touched files, including existing `TS2554` errors in:
  - `src/agents/anthropic-payload-log.ts`
  - `src/agents/pi-embedded-runner/extra-params.ts`

## Honest mission state after this run

Completed in substance:

- positive-path proof
- denial-path proof
- depth/fanout stop proof
- clearer runtime guidance for correct spawn mode selection

Still open before Mission 008 can be sealed:

- delegation contract admission and final authorized spawner list
- publish recommendation and bundle
- closeout packet and sealed run

## Next recommendation

Use this receipt bundle as the acceptance base for the next Mission 008 move:

1. finalize the Alpha delegation contract
2. decide the admitted spawner set explicitly
3. file the publish recommendation
4. run final closeout only after those governance steps are complete
