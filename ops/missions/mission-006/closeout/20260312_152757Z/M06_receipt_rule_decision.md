# M06 Receipt Rule Decision (Audited Chain)

## VERIFIED CURRENT STATE

- Accepted contract for this audited chain:
  - `provider_id` and `model_id` are represented as multi-step/per-role provenance.
  - `job_id`, `agent_uuid`, `agent_fingerprint` are source-limited unknown/null.
  - No fabricated provenance values are allowed.
- Scope applies only to audited chain and audited surfaces.

## TARGET / INTENDED STATE

- Stable, truthful receipt semantics for this chain.

## UNKNOWN / TO VERIFY

- Whether other runtime paths need different receipt rules.

## RISKS / BLOCKERS

- Applying this rule globally without path-specific audit is invalid.

## EXACT NEXT ACTION

- Treat this as the frozen mission-006 receipt rule in reviewed closeout.
