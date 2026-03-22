# 02 — Workload and Route Matrix

Use this file before choosing a prompt template.

## Task sizes

### Micro

Examples:

- answer one precise repo question
- inspect one file
- run one safe read-only command

Default route:

- single-agent direct

Avoid:

- plan-first
- subagents
- cloud delegation

### Small

Examples:

- patch one small bug
- update one file in a bounded way
- add one narrow validation

Default route:

- single-agent direct

Upgrade to plan-first only if the path is unclear.

### Medium

Examples:

- multi-file bug fix
- narrow refactor with known target
- diagnose and repair one failing test area

Default route:

- single-agent direct if clear
- plan-first if ambiguity is material

Optional:

- subagent reconnaissance only when parallel exploration or review provides clear leverage

### Large

Examples:

- multi-step refactor
- architecture repair across several subsystems
- migration with non-trivial risk

Default route:

- plan-first

Then choose one:

- bounded local execution
- subagent-assisted reconnaissance/review
- cloud delegation for long implementation

### Long-horizon

Examples:

- broad migration program
- multi-milestone architecture rebuild
- long-running mission stream

Default route:

- plan-first with milestone decomposition
- explicit handoff discipline
- repeated closeout checkpoints

## Route definitions

### Route A — Direct execution

Use when:

- task is clear
- blast radius is bounded
- expected validation path is straightforward

### Route B — Plan-first

Use when:

- path is unclear
- there are multiple plausible approaches
- acceptance criteria need shaping before mutation

### Route C — Subagent-assisted

Use when:

- work benefits from parallel read-heavy exploration
- you need multiple perspectives before choosing an implementation path
- the lead agent can still synthesize results cleanly

Default stance:

- reconnaissance / review, not blind parallel mutation

### Route D — Cloud delegation

Use when:

- the work is larger than you want to execute locally in one live loop
- the operator wants a longer implementation run offloaded
- local review and validation will still happen before acceptance

## Split triggers

Stop and split the work when:

- more than one milestone is being bundled into the same prompt
- the validation path is not obvious
- there are overlapping risky file clusters
- the model starts producing plan + mutation + rollout + handoff in one pass
- the task naturally divides into recon -> decision -> implementation -> verification
