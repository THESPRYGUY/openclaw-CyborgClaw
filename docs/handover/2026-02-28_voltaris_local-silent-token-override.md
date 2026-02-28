# Handover — Local Silent Token Override Sprint (Voltaris) — 2026-02-28

## Traffic light

🟡 Local lane still timing out on full-context runs; Cloud lane is P0.

## Objective

Make the “silent reply token” configurable via `OPENCLAW_SILENT_REPLY_TOKEN`, so `NO_REPLY` is not hardwired as the only silent sentinel across the auto-reply + embedded runner stack.

## Ground truth environment

- Gateway systemd env includes: `OPENCLAW_SILENT_REPLY_TOKEN=QUIET_TOKEN_9F3A`
- Ollama reachable at: `http://127.0.0.1:11434`
- Gateway listening: `ws://127.0.0.1:18789`
- Model used in tests: `qwen2.5-coder:14b`

## Key finding

Direct Ollama calls can respond quickly (~7–8s) for tiny prompts, but OpenClaw “full context” runs often time out (120–300s) and abort the underlying Ollama request. This is primarily a **prompt-size / prefill / CPU** issue, not a pure Ollama connectivity failure.

## What was shipped (code)

Branch:

- `sprint/local-silent-token-override`

Commit:

- `e8288c8ec` — "sprint: env-driven silent reply token plumbing"

Modified files:

- `src/agents/pi-embedded-runner/run/payloads.ts`
  - Uses `process.env.OPENCLAW_SILENT_REPLY_TOKEN ?? SILENT_REPLY_TOKEN`
  - Threads `silentToken` into `parseReplyDirectives(..., { silentToken })`
  - Uses `silentToken` when checking `isSilentReplyText`
- `src/auto-reply/tokens.ts`
  - Added `resolveSilentReplyToken(): string` => `process.env.OPENCLAW_SILENT_REPLY_TOKEN ?? SILENT_REPLY_TOKEN`
- `src/auto-reply/reply/get-reply.ts`
  - Typing controller now uses `resolveSilentReplyToken()` instead of hard-coded `SILENT_REPLY_TOKEN`
- `src/auto-reply/reply/get-reply-run.ts`
  - Group intro now uses `resolveSilentReplyToken()` so prompting stops teaching “NO_REPLY is the magic silent word”
- `src/auto-reply/reply/agent-runner-execution.ts`
  - Drop filter now uses `resolveSilentReplyToken()` so “NO_REPLY” is not always suppressed
- `src/auto-reply/reply/agent-runner-payloads.ts`
  - Directive normalization now uses `resolveSilentReplyToken()`

## Evidence receipts

- Successful build after fixes: `pnpm build` passed.
- Gateway restarted and active (PID observed in session).
- Even after fix deployment, some runs still timed out and produced `openclaw:prompt-error` with `error:"aborted"` in the session jsonl (timeout-driven cancellation).

## Known blockers (why local still flaky)

- Full-context prompt size (~4.5k input tokens observed) leads to slow runs on CPU and frequent aborts at 120–300s timeouts.
- Local lane remains P2 (night shift / optimization track). Cloud lane is P0 for throughput.

## “Do not repeat”

- Do not chase Vulkan/GPU acceleration beyond a strict timebox unless you have a known-good path.
- Do not let local instability block cloud strike teams.

## Next resume steps (when we pick this back up)

1. Keep cloud-first strike teams operational.
2. For local: reduce prompt payload (skills/context/session injection) or create a “minimal local mode” agent for batch/night-shift.
3. Verify silent-token behavior with a test where model returns `NO_REPLY` and ensure it is not suppressed when `OPENCLAW_SILENT_REPLY_TOKEN=QUIET_TOKEN_9F3A`.
