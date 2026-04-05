# Mission 009 - Live Watch Checklist

Use this during the Swarm Unlock V2 run. Do not call the run healthy unless every section has observable evidence.

## Preflight

- Gateway is up and Control UI is loading.
- Benchmark preflight is green.
- Alpha mission room loads fast enough to trust.
- Alpha roster wall loads fast enough to trust.
- Mission room and roster wall agree on admitted seats.
- Canonical seat cards expose a `spawnSummary` rail.

## Parent seat dispatch

- One admitted Alpha parent seat reaches `acknowledged`.
- The same seat reaches `in_progress`.
- The job leaves “quiet idle” posture.
- Mission room and roster wall both show that parent as live work, not just governance state.

## Child spawn

- Exactly one bounded child unit is created under the current parent seat.
- The child is tied to the current job, not floating proof work.
- Parent -> child lineage is visible on the parent card.
- Child work does not appear as a peer roster seat.

## Child execution

- Child status is live, not just derived.
- Child scope is visible enough to explain why it exists.
- Last child receipt/proof timestamp is visible.
- Failure/timeout state is explicit if the child stalls or errors.

## Parent acceptance

- Parent can explicitly accept or reject child output.
- Acceptance state is visible on the parent card.
- Rejection remains visible and blocks progression.

## Workforce progression

- The workforce job advances beyond `dispatched`.
- At least one parent seat completes via accepted child work.
- Mission room reflects the same transition without manual refresh tricks.

## Publish and seal

- Publish bundle is filed.
- Publish posture does not imply wider live swarm rollout.
- Closeout packet is filed.
- Job archives and seals cleanly.

## MVP ticker reassessment

Raise only if:

- child execution advanced real job state
- telemetry truth stayed obvious
- parent acceptance was explicit
- publish and seal required no narrative stitching

Hold or lower if:

- the child worked but the job stalled
- telemetry required inference
- stale or derived data masqueraded as live
- authority or closeout remained ambiguous
