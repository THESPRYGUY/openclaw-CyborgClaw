# A2A_COLLAB_PROOF_BRIEF

## Mission title

`Implement real-time agent-to-agent collaboration and proof back-briefing for Strike Team Alpha seat execution`

## Mission status

- Prepared by: `Codex`
- Strategic owner: `Voltaris V2`
- Operator authority: `Glen`
- Packet status: `IMPLEMENTED AND READY FOR REVIEW`

## Objective

Turn the bounded President-A fan-out seam into a collaborative and evidence-driven execution lane where Strike Team Alpha seat agents can exchange admitted A2A updates, submit structured proof back-briefs, and roll those signals back into the shared `Job Card` truth.

The lane was accepted to deliver:

1. a bounded A2A collaboration protocol for admitted seat agents
2. structured proof back-briefing tied to seat tasks and the parent `Job Card`
3. President-A review and aggregation of submitted proof
4. cockpit, inspector, feed, and bridge visibility for collaboration and proof signals
5. tests proving collaboration, proof submission, review, and bridge synchronization end to end

## Scope delivered

### 1. Bounded A2A collaboration protocol

The sibling Sprytly workforce runtime now admits a durable collaboration message log beneath each active `Job Card`.

Each collaboration record now carries:

- `messageId`
- `seatTaskId`
- `relatedSeatTaskId`
- `replyToMessageId`
- `fromAgentId`
- `fromRole`
- `toAgentId`
- `toRole`
- `kind`
- `kindLabel`
- `subject`
- `detail`
- `contextRefs`
- `artifactRef`
- `createdAt`
- `updatedAt`
- `lastSignalAt`
- `lastSignalDetail`
- `summaryLabel`

Admitted collaboration kinds are:

- `request_context`
- `share_context`
- `dependency_update`
- `blocker_escalation`
- `partial_proof`

This remains intentionally bounded:

- only the admitted seat owner can originate the collaboration message
- the target must be another admitted seat or President-A
- the current seat-session key must match
- A2A remains coordination evidence, not a durable job queue

### 2. Structured proof back-briefing

The sibling Sprytly runtime now admits structured proof records instead of relying only on seat-status details or single `artifactRef` fields.

Each proof back-brief now carries:

- `proofId`
- `seatTaskId`
- `agentId`
- `displayName`
- `proofKind`
- `proofKindLabel`
- `summary`
- `detail`
- `resultLabel`
- `artifactRefs`
- `artifactRef`
- `reviewStatus`
- `reviewDetail`
- `reviewerNodeId`
- `submittedAt`
- `reviewedAt`
- `lastSignalAt`
- `runId`
- `sessionKey`

Admitted proof kinds are:

- `artifact`
- `verification`
- `handoff`
- `closeout`

Proof review states now admit:

- `submitted`
- `accepted`
- `rejected`

This makes the seat proof lane explicit and inspectable rather than hiding it inside free-form status strings.

### 3. President-A aggregation and review

President-A now has a dedicated review seam for structured proof instead of overloading seat completion.

What is now true:

- seat agents can submit structured proof without pretending the proof is already accepted
- President-A can accept or reject a specific proof record
- rejected proof blocks the parent `Job Card`
- accepted proof preserves the seat-task lifecycle while updating the proof board and execution truth
- collaboration and proof state are synchronized back into the President-A session bridge and affected seat session bridges

The `Job Card` summary now carries:

- `collaborationBoard`
- `collaborationFeed`
- `proofBoard`
- `proofBackbriefs`

This means President-A and the operator can inspect both the coordination trail and the evidence trail in one admitted runtime story.

### 4. Cockpit, inspector, and execution-feed visibility

The Workforce Alpha cockpit now surfaces collaboration and proof state as part of the active job view.

The `Job dispatch` strip now shows:

- board-level collaboration posture
- board-level proof posture
- per-seat collaboration counts
- per-seat inbound collaboration counts
- per-seat proof counts
- latest proof status / label
- compact previews of recent collaboration messages and proof back-briefs

The inspector `Job card` surface now admits:

- collaboration board summary
- proof board summary
- collaboration preview cards
- proof preview cards
- seat-level collaboration/proof pills
- seat inbox and seat proof preview in the seat brief drill-down

The execution feed now surfaces persisted collaboration / proof event context, including:

- collaboration kind
- proof review status
- proof summary

### 5. Test hardening

The lane added or expanded proof for:

- helper-level collaboration record creation
- helper-level structured proof creation and review
- board summary synchronization
- runtime seat-task / bridge roll-up after collaboration and proof
- full API proof for:
  - create
  - delegate
  - fan-out
  - seat start
  - seat collaboration
  - seat `await_review`
  - proof submission
  - President-A proof review
  - execution feed readback
  - President-A session bridge readback
  - source-seat and target-seat bridge readback

## Implemented interfaces

### Backend modules

- `../sprytly-internal-dashboard/server/src/db.js`
- `../sprytly-internal-dashboard/server/src/workforceJobDispatch.js`
- `../sprytly-internal-dashboard/server/src/index.js`

### Frontend surface

- `../sprytly-internal-dashboard/web/src/pages/MissionControlWorkforceAlphaPage.jsx`

### Test coverage

- `../sprytly-internal-dashboard/scripts/tests/workforce_job_dispatch.test.mjs`
- `../sprytly-internal-dashboard/scripts/tests/workforce_job_dispatch_api.test.mjs`

## Acceptance criteria for this lane

This lane is accepted when:

1. admitted Strike Team seats can exchange bounded collaboration records on an active `Job Card`
2. admitted Strike Team seats can submit structured proof tied to a specific seat task
3. President-A can review structured proof with an explicit accept/reject decision
4. collaboration and proof signals are durably recorded into workforce job state
5. session-context bridge state stays synchronized for President-A, the source seat, and affected target seats
6. cockpit and inspector surfaces expose collaboration and proof truth without inventing runtime ownership
7. execution feed reflects persisted collaboration/proof lifecycle events
8. unit and API tests prove the collaboration / proof seam end to end

## Validation proof

Implementation proof was accepted against:

- syntax checks:
  - `node --check ../sprytly-internal-dashboard/server/src/index.js`
  - `node --check ../sprytly-internal-dashboard/server/src/workforceJobDispatch.js`
- targeted dispatch helper tests
- targeted dispatch API tests
- full sibling Sprytly test suite
- sibling build
- sibling lint with warnings only and no errors
- sibling server startup against the existing `server/data/sprytly.db` runtime store
- live dashboard availability on `127.0.0.1:18792`

The API integration proof specifically covered:

- queued DEV-staging To-Do promotion into a `Job Card`
- delegation to President-A
- President-A seat fan-out
- seat start
- bounded collaboration message from one seat to another
- seat move to `awaiting_review`
- structured proof back-brief submission
- President-A proof acceptance
- execution feed readback for:
  - `workforce.job_card.a2a_collaboration_logged`
  - `workforce.job_card.proof_backbrief_submitted`
  - `workforce.job_card.proof_backbrief_reviewed`
- President-A session-store bridge readback
- source-seat proof bridge readback
- target-seat collaboration inbox readback

## Risks carried forward

### Immediate blockers

None.

### Accepted follow-on risks

- collaboration is still a bounded session-context bridge plus admitted event ledger, not a full native inter-agent transport
- proof review is still leadership-mediated rather than cryptographically verified
- cockpit freshness is still polling-based rather than push/subscription based
- inter-seat collaboration remains intentionally scoped to the active `Job Card` and admitted seats only
- broader multi-president / multi-team collaboration routing remains intentionally deferred
- the final long-term split between Sprytly planning state and OpenClaw runtime metadata remains broader than this lane

## Recommended next lane

`Implement push/subscription-based cockpit freshness and richer live collaboration receipts for Workforce Alpha.`
