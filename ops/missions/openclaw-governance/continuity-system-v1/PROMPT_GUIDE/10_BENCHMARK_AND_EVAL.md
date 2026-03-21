# 10 — Benchmark and Eval

Use this file to compare route effectiveness.

## Core comparison lanes

1. single-agent direct execution
2. plan-first then single-agent execution
3. leader + subagent reconnaissance/review
4. cloud delegation + local review

## Suggested benchmark tasks

- one bounded bug fix
- one medium multi-file repair
- one architecture reconnaissance task
- one test-failure triage task
- one larger implementation prep task

## Metrics

- prompt size / burden
- time to first useful result
- validation completeness
- scope discipline
- operator clarity
- drift rate
- rework required after first pass

## Evaluation questions

- Did the route choice help or hurt?
- Was the prompt smaller and clearer than legacy style?
- Did subagents add signal or noise?
- Did cloud delegation reduce or increase review burden?
- What should become the default for this task class next time?
