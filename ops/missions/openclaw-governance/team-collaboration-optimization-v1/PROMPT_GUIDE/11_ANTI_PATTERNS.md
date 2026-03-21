# 11 — Anti-patterns

## Wrapper bloat

Do not stuff every persistent rule into every prompt.

## Fake precision

Do not present guesses as proven facts.

## Multi-milestone sprawl

Do not ask for diagnosis + redesign + implementation + validation + rollout in one shot.

## Casual subagent use

Do not use subagents just because they exist.

## Parallel write chaos

Do not normalize overlapping write-heavy subagent work across the same file cluster.

## Mission-state pollution

Do not put short-lived task state into `AGENTS.md`.

## No-receipt closeout

Do not claim success without relevant validation evidence.

## Hidden cleanup drift

Do not allow “while I was here” expansions unless explicitly approved.
