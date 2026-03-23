# COCKPIT_FRESHNESS_BRIEF

## Mission title

`Implement push/subscription-based cockpit freshness and richer live collaboration receipts for Workforce Alpha`

## Mission status

- Prepared by: `Codex`
- Strategic owner: `Voltaris V2`
- Operator authority: `Glen`
- Packet status: `IMPLEMENTED AND READY FOR REVIEW`

## Objective

Replace the prior polling-only cockpit freshness model with a truthful push/subscription seam and make live collaboration / proof receipts materially more useful for operators.

The lane was accepted to deliver:

1. a backend push/subscription service for Workforce Alpha lifecycle events
2. real-time cockpit updates without relying solely on 15-second polling
3. richer collaboration / proof receipts for the active job surface and execution feed
4. tests proving the new live seam and refreshed read-model truth

## Scope delivered

### 1. Push-first cockpit freshness

The sibling Sprytly Workforce Alpha surface now admits a dedicated SSE stream:

- `GET /api/mission-control/workforce/alpha/stream`

The stream now:

- authenticates through the existing `/api` session boundary
- sends an initial `connected` envelope with fresh snapshot + execution payloads
- emits `workforce_update` events whenever durable Workforce lifecycle events land
- sends heartbeat `ping` events to keep the seam alive
- falls back to polling only when the live seam is unavailable or reconnecting

This keeps the implementation truthful:

- `activity_events` remains the durable ledger
- snapshot / execution payloads are still generated from the current read models
- the push seam improves freshness; it does not become a second source of truth

### 2. Richer live collaboration receipts

The lane adds a normalized live receipt shape for Workforce events.

Each pushed receipt now admits:

- `eventId`
- `eventType`
- `eventSummary`
- `eventAt`
- `receivedAt`
- `receiptKind`
- `jobId`
- `status`
- `progressLabel`
- `actorNodeId`
- `actorDisplayName`
- `targetNodeId`
- `targetDisplayName`
- `fromAgentId`
- `toAgentId`
- `seatTaskId`
- `seatStatus`
- `seatDisplayName`
- collaboration fields:
  - `messageId`
  - `collaborationKind`
  - `collaborationLabel`
  - `subject`
  - `detail`
  - `contextRefs`
  - `replyToMessageId`
- proof fields:
  - `proofId`
  - `proofKind`
  - `proofReviewStatus`
  - `proofSummary`
  - `resultLabel`
  - `reviewDetail`
- artifact / runtime fields:
  - `artifactRef`
  - `artifactRefs`
  - `runId`
  - `sessionKey`
  - `escalationTarget`
  - `reason`
  - `outcome`

This means the cockpit now shows who sent what to whom, when it landed, which seat it affected, and which proof / artifact references were involved.

### 3. Execution feed and command-strip upgrades

The Workforce Alpha page now uses the live seam to keep the cockpit fresher and clearer.

The `Execution Feed` now shows:

- live seam connection state
- last live receipt age
- buffered receipt count
- inbound as well as outbound node filtering
- richer actor / seat / target labeling
- explicit collaboration / proof pills on live items

The `Job dispatch` strip now admits:

- a `Live collaboration receipts` section
- compact receipt cards for recent collaboration / proof / review events
- actor and target identity
- seat context
- artifact summary
- proof review detail when present

### 4. Durable event enrichment

The lane enriches stored Workforce lifecycle events so the pushed stream and the readback payloads are materially stronger.

Notable additions include:

- default `fromAgentId` / `toAgentId` on emitted Workforce events
- collaboration event detail:
  - `subject`
  - `contextRefs`
  - `replyToMessageId`
- proof event detail:
  - `artifactRefs`
  - `resultLabel`
  - `reviewDetail`

Because these fields are written into the same durable event seam, the execution feed, recent timeline, and live stream now agree on the same evidence story.

### 5. Test hardening

The lane added or expanded proof for:

- signal-health freshness levels:
  - `live`
  - `recent`
  - `aging`
- post-mutation freshness readback through `/alpha` and `/snapshot`
- live SSE handshake and event delivery
- pushed collaboration receipts with context lineage
- pushed proof receipts with artifact metadata and review detail
- refreshed snapshot / execution payloads arriving through the stream

## Implemented interfaces

### Backend modules

- `../sprytly-internal-dashboard/server/src/index.js`

### Frontend surface

- `../sprytly-internal-dashboard/web/src/pages/MissionControlWorkforceAlphaPage.jsx`

### Test coverage

- `../sprytly-internal-dashboard/scripts/tests/workforce_job_dispatch.test.mjs`
- `../sprytly-internal-dashboard/scripts/tests/workforce_job_dispatch_api.test.mjs`

## Acceptance criteria for this lane

This lane is accepted when:

1. Workforce Alpha admits a live push/subscription seam for cockpit freshness
2. the cockpit no longer depends solely on fixed polling to observe active collaboration / proof changes
3. live receipts surface actor, target, seat, proof, and artifact context clearly
4. execution feed readback reflects the same enriched event detail as the pushed seam
5. tests prove the live stream, collaboration receipts, proof receipts, and refreshed read-models end to end

## Validation proof

Implementation proof was accepted against:

- syntax check:
  - `node --check ../sprytly-internal-dashboard/server/src/index.js`
- targeted helper tests
- targeted workforce API tests
- full sibling Sprytly test suite
- sibling build
- sibling lint with warnings only and no errors

The API integration proof specifically covered:

- authenticated connection to `/api/mission-control/workforce/alpha/stream`
- initial `connected` envelope with fresh snapshot + execution payloads
- seat start signal landing after fan-out
- bounded collaboration receipt push
- proof submission receipt push
- proof review receipt push
- refreshed snapshot readback inside the pushed stream
- refreshed execution payload readback inside the pushed stream

## Risks carried forward

### Immediate blockers

None.

### Accepted follow-on risks

- the push seam is SSE, not a broader native workforce transport
- cockpit freshness is now live-first, but inspector refresh still uses targeted refetch rather than full live inspector subscription
- collaboration remains intentionally bounded to admitted seats on the active `Job Card`
- broader multi-president / multi-team push routing remains deferred
- the longer-term planning/runtime split between Sprytly state and OpenClaw runtime metadata is still broader than this lane

## Recommended next lane

`Implement full ACP-native inter-agent transport and richer admitted inspector subscriptions for Workforce Alpha.`

That next lane should:

1. reduce dependence on session-context bridge signaling alone
2. strengthen live readback for inspector drill-downs without targeted refetch
3. prepare the path from bounded Alpha collaboration toward broader workforce routing
