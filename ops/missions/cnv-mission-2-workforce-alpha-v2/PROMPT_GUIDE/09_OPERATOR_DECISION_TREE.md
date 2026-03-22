# 09 — Operator Decision Tree

## Step 1 — Is the task clear and bounded?

If yes:

- go to Step 2

If no:

- use plan-first

## Step 2 — Is the task micro or small?

If yes:

- use direct single-agent execution

If no:

- go to Step 3

## Step 3 — Is the main bottleneck ambiguity or strategy?

If yes:

- use plan-first

If no:

- go to Step 4

## Step 4 — Would parallel read-heavy exploration or review materially help?

If yes:

- use subagent-assisted reconnaissance / review

If no:

- go to Step 5

## Step 5 — Is the implementation large enough to justify offloading?

If yes:

- use cloud delegation with local review

If no:

- use bounded local execution

## Stop-and-split checks

Stop and split the step when:

- there is more than one milestone in the prompt
- the validation path is unclear
- the model starts doing “helpful extras” outside scope
- risky file clusters need separate treatment
