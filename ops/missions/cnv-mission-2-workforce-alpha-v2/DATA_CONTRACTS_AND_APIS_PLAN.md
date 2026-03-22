# DATA_CONTRACTS_AND_APIS_PLAN

## Purpose

Turn the ratified Workforce Alpha V2 charrette into one evidence-first contract-planning packet that names:

- the proven generic Control UI sources already present in the repo
- the projected adapter paths that can reuse those sources honestly
- the genuinely new Workforce Alpha contracts that must exist before the cockpit can claim full truth

## Evidence basis

- `docs/web/control-ui.md` proves the current Control UI transport is Gateway WebSocket RPC and names the existing method families.
- `src/gateway/control-ui-contract.ts` proves the bootstrap config contract: `basePath`, `assistantName`, `assistantAvatar`, `assistantAgentId`, and optional `serverVersion`.
- `src/gateway/control-ui-routing.ts`, `src/gateway/control-ui.ts`, `src/gateway/server-http.ts`, and `src/gateway/server-runtime-config.ts` prove the current generic Control UI mount seam.
- `ui/src/ui/navigation.ts`, `ui/src/ui/app-render.ts`, `ui/src/ui/app-settings.ts`, and `ui/src/ui/views/overview.ts` prove the existing `overview` route is generic Control UI, not a Workforce-specific cockpit.
- `ui/src/ui/controllers/agents.ts`, `agent-identity.ts`, `presence.ts`, `sessions.ts`, `usage.ts`, `cron.ts`, `logs.ts`, `health.ts`, `config.ts`, and `exec-approvals.ts` prove the existing generic RPC and controller surface.
- `ui/src/ui/types.ts`, `src/shared/session-types.ts`, `src/shared/usage-types.ts`, `src/shared/node-list-types.ts`, `src/infra/system-presence.ts`, and the relevant gateway server methods prove the current typed payload fragments that can seed Workforce Alpha planning.
- The repo still does not prove a repo-local Workforce Alpha V1 page contract or a Workforce-specific cockpit DTO.

## Section framing

- VERIFIED CURRENT STATE: the repo already has a generic Gateway-backed Control UI with typed building blocks for bootstrap identity, agents, presence, sessions, usage, cron, health, config, approvals, logs, node inventory, and session preview.
- TARGET ARCHITECTURE: Workforce Alpha V2 should consume a small number of normalized Workforce-specific gateway RPCs that aggregate those generic sources and emit explicit trust/provenance metadata.
- TO VERIFY / UNCONFIRMED: the command hierarchy, operator-state rollups, normalized execution feed, evidence rollups, and inspector drill-down provenance are not currently emitted as first-class Workforce contracts.

## Implementation status

- VERIFIED CURRENT STATE: the sibling `sprytly-internal-dashboard` backend now exposes an authenticated transitional REST facade at `/api/mission-control/workforce/alpha/snapshot`.
- TARGET ARCHITECTURE: that route now emits a normalized Workforce snapshot DTO nested under `snapshot`, covering `canopy`, `liveOps`, `tree`, `evidence`, and `contractGaps`, with explicit `trustState`, `sourceKinds`, `updatedAt`, `missingFields`, and `notes`.
- VERIFIED CURRENT STATE: the sibling backend now also exposes authenticated transitional REST facades at `/api/mission-control/workforce/alpha/execution` and `/api/mission-control/workforce/alpha/inspector`.
- TARGET ARCHITECTURE: those routes emit normalized execution-feed and inspector DTOs with explicit `trustState`, `sourceKinds`, `updatedAt`, `missingFields`, and `notes`, while truthfully projecting from `activity_events`, the local session store, JSONL session logs, the alpha roster manifest, and OpenClaw config when authoritative Workforce-native seams do not yet exist.
- TO VERIFY / UNCONFIRMED: long-term Gateway RPC transport, artifact/receipt linkage, governance-link DTOs, and several hierarchy / rollup fields still remain future backend work even after the ratified REST API slice landed.

## Verified source inventory

| Need area                   | Proven source(s)                                                                                                                                                                                                                                       | Truthfully available now                                                                         | Limits                                                                                                                  |
| --------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------ | ----------------------------------------------------------------------------------------------------------------------- |
| Repo-local surface / mount  | `src/gateway/control-ui-contract.ts`, `src/gateway/control-ui-routing.ts`, `src/gateway/control-ui.ts`, `src/gateway/server-http.ts`, `ui/src/ui/navigation.ts`, `ui/src/ui/app-render.ts`, `ui/src/ui/app-settings.ts`, `ui/src/ui/views/overview.ts` | Generic Control UI bootstrap, routing, and `overview` mount                                      | No Workforce Alpha-specific route or bootstrap contract found.                                                          |
| Bootstrap identity          | `src/gateway/control-ui-contract.ts`, `ui/src/ui/controllers/control-ui-bootstrap.ts`                                                                                                                                                                  | `basePath`, `assistantName`, `assistantAvatar`, `assistantAgentId`, optional `serverVersion`     | Only identifies the generic assistant/bootstrap surface; does not prove the full Workforce hierarchy.                   |
| Agent catalog               | `ui/src/ui/controllers/agents.ts`, `ui/src/ui/controllers/agent-identity.ts`, `src/shared/session-types.ts`, `src/gateway/protocol/schema/agents-models-skills.ts`, `src/gateway/server-methods/agent.ts`                                              | agent ids, optional names, optional identity metadata, default agent id                          | No canonical `reports_to`, command role, or Strike Team Alpha membership.                                               |
| Session lineage hints       | `src/config/sessions/types.ts`, `src/gateway/session-utils.ts`                                                                                                                                                                                         | `spawnedBy`, `spawnedWorkspaceDir`, `spawnDepth`, `subagentRole`, `subagentControlScope`         | Execution lineage is not the same thing as command hierarchy.                                                           |
| Presence / liveliness hints | `ui/src/ui/controllers/presence.ts`, `src/infra/system-presence.ts`, `ui/src/ui/types.ts`                                                                                                                                                              | host/device presence, roles, scopes, mode, recency hints, instance timestamp                     | Not a ratified Workforce node-state taxonomy; cannot alone distinguish blocked vs stale vs missing telemetry.           |
| Session activity            | `ui/src/ui/controllers/sessions.ts`, `ui/src/ui/types.ts`                                                                                                                                                                                              | session key, display label, surface, updatedAt, model/provider, token/context counts             | No stable per-node job contract, no run start time, no hierarchy mapping.                                               |
| Usage / token history       | `ui/src/ui/controllers/usage.ts`, `src/shared/usage-types.ts`, `src/gateway/server-methods/usage.ts`                                                                                                                                                   | historical usage per session / agent, provider/model aggregates                                  | Historical / analytical, not a live command-cockpit state feed by itself.                                               |
| Node inventory              | `ui/src/ui/controllers/nodes.ts`, `src/shared/node-list-types.ts`, `src/gateway/node-registry.ts`, `src/gateway/server-methods/nodes.ts`                                                                                                               | node id, display name, connectivity, device/platform info, permissions/caps                      | Node inventory is not the same thing as the Workforce Alpha agent hierarchy.                                            |
| Cron history                | `ui/src/ui/controllers/cron.ts`, `ui/src/ui/types.ts`, `src/gateway/server-methods/cron.ts`                                                                                                                                                            | run timestamps, job ids, status, duration, session ids/keys, model/provider                      | Useful evidence seed, but not a general Workforce execution-feed contract.                                              |
| Health / heartbeat          | `ui/src/ui/controllers/health.ts`, `ui/src/ui/types.ts`, `src/commands/health.ts`, `src/gateway/server/health-state.ts`                                                                                                                                | overall health summary, session count, recent session summaries, hello-snapshot health fragments | Not a per-Workforce-node truth source.                                                                                  |
| Config / governance         | `ui/src/ui/controllers/config.ts`, `ui/src/ui/controllers/exec-approvals.ts`, `src/gateway/protocol/schema/exec-approvals.ts`                                                                                                                          | config path/hash/issues, approval allowlist snapshots, approval governance context               | Useful provenance/governance inputs, but not contract-gap or receipt-coverage rollups.                                  |
| Logs / event traces         | `ui/src/ui/controllers/logs.ts`, `ui/src/ui/app-gateway.ts`, `ui/src/ui/app-events.ts`, `src/gateway/server-node-events.ts`, `src/infra/system-events.ts`, `src/commands/status.summary.ts`                                                            | tailed log lines, generic websocket events, queued system events                                 | Generic diagnostic/event stream only; not a normalized Workforce execution or evidence model.                           |
| Inspector seeds             | `src/gateway/server-methods/sessions.ts`, `src/gateway/session-utils.fs.ts`, `src/gateway/server-methods/usage.ts`, `src/gateway/server-methods/nodes.ts`, `src/gateway/server-methods/agents.ts`                                                      | session preview, usage rows, node detail, workspace/file inspection                              | No dedicated Workforce inspector contract for artifact links, receipt links, governance flags, or metric trust sources. |

## Contract principles

1. Keep transport truthful: the verified transport today is Gateway WebSocket RPC, not REST. This plan therefore defines RPC methods first. If an HTTP facade is ever added later, it should mirror the same DTOs and semantics rather than invent a second truth surface.
2. Do not force the UI to infer hierarchy from card order. `Voltaris V2`, `President-A`, and Alpha roster membership must be explicit contract data.
3. Do not force the UI to infer trust. Every operator-visible metric must carry trust/provenance metadata or be shown as missing.
4. Do not force the UI to derive the full execution feed from raw logs. Normalization belongs in the contract layer.
5. Use existing generic sources where they are truthful, but upgrade them into Workforce DTOs server-side so the cockpit can load atomically instead of fan-out loading unrelated sources.

## Target architecture

### Shared enums and envelope rules

These are target-contract definitions, not claims that the current repo already emits them:

```ts
type WorkforceTrustState = "observed" | "projected" | "manifest_only" | "missing";

type WorkforceNodeState =
  | "active"
  | "idle_ready"
  | "awaiting_approval"
  | "blocked"
  | "degraded"
  | "stale"
  | "missing_telemetry"
  | "offline";

type WorkforceExecutionOutcome = "succeeded" | "stalled" | "escalated";
```

Every major DTO should include:

- `trustState`
- `sourceKinds`
- `updatedAt`
- `missingFields`
- `notes`

Uniform emission of that provenance envelope is `NEW CONTRACT NEEDED`.

## Proposed RPC surface

### 1. `workforce.alpha.snapshot.get`

Purpose: return one atomic snapshot for `Command Canopy`, `Live Ops Strip`, `Chain of Command Tree`, and `Evidence + Governance Rail`.

Transport: Gateway WebSocket RPC via `GatewayBrowserClient.request(...)`.

Auth: same operator-read boundary already used by the current Control UI.

Performance intent: replace the current `loadOverview(...)` fan-out for the Workforce cockpit with one server-assembled snapshot so the command story is coherent at render time.

Implementation note:

- VERIFIED CURRENT STATE: the first backend slice is now implemented in the sibling `sprytly-internal-dashboard` repo as an authenticated transitional REST route: `GET /api/mission-control/workforce/alpha/snapshot`.
- TARGET ARCHITECTURE: the route emits the normalized Workforce snapshot DTO inside a top-level `snapshot` envelope while preserving the existing legacy `/api/mission-control/workforce/alpha` contract untouched.
- TO VERIFY / UNCONFIRMED: the long-term transport target remains Gateway WebSocket RPC; this lane does not claim that the Gateway RPC surface itself is already implemented.

Request:

```ts
type WorkforceAlphaSnapshotGetParams = {
  includeEvidence?: boolean;
  includeProjected?: boolean;
};
```

Response:

```ts
type WorkforceAlphaSnapshot = {
  generatedAt: string;
  canopy: WorkforceAlphaCanopy;
  liveOps: WorkforceAlphaLiveOpsStrip;
  tree: WorkforceAlphaCommandTree;
  evidence: WorkforceAlphaEvidenceRail;
  contractGaps: WorkforceAlphaContractGap[];
};
```

#### `WorkforceAlphaCanopy`

| Field                                          | Type                 | Status                | Source / note                                                                                                                    |
| ---------------------------------------------- | -------------------- | --------------------- | -------------------------------------------------------------------------------------------------------------------------------- |
| `lead.agentId`                                 | `string`             | `PROJECTED`           | Seedable from `assistantAgentId` and `agent.identity.get`, but only if the bootstrap assistant is confirmed to be `Voltaris V2`. |
| `lead.displayName`                             | `string`             | `PROJECTED`           | Seedable from `assistantName` and `agent.identity.get`; still needs authoritative Workforce identity mapping.                    |
| `lead.avatar`                                  | `string`             | `PROJECTED`           | Seedable from `assistantAvatar`; not enough alone to prove command role.                                                         |
| `lead.roleLabel`                               | `string`             | `NEW CONTRACT NEEDED` | No current role contract.                                                                                                        |
| `lead.state`                                   | `WorkforceNodeState` | `PROJECTED`           | Could be derived from presence/session/health inputs once hierarchy mapping and state rules are ratified.                        |
| `commander.agentId`                            | `string`             | `NEW CONTRACT NEEDED` | No authoritative `President-A` contract in tracked repo evidence.                                                                |
| `commander.displayName`                        | `string`             | `NEW CONTRACT NEEDED` | Same gap as above.                                                                                                               |
| `currentMissionLabel`                          | `string \| null`     | `NEW CONTRACT NEEDED` | No current mission-label contract for the canopy.                                                                                |
| `lastOrchestrationEventLabel`                  | `string \| null`     | `NEW CONTRACT NEEDED` | Generic logs/events exist, but no normalized orchestration label exists.                                                         |
| `activeRunCount`                               | `number`             | `PROJECTED`           | Potentially derivable from `sessions.list` once agent-to-command-node mapping exists.                                            |
| `approvalsPendingCount`                        | `number`             | `NEW CONTRACT NEEDED` | Current approvals surface is configuration-oriented, not a pending-request ledger.                                               |
| `staleOrDownstreamIssueCount`                  | `number`             | `NEW CONTRACT NEEDED` | No current rollup contract.                                                                                                      |
| `trustState` / `sourceKinds` / `missingFields` | envelope fields      | `NEW CONTRACT NEEDED` | Needed to keep canopy truth explicit.                                                                                            |

#### `WorkforceAlphaLiveOpsStrip`

| Field                   | Type             | Status                | Source / note                                                          |
| ----------------------- | ---------------- | --------------------- | ---------------------------------------------------------------------- |
| `activeCount`           | `number`         | `PROJECTED`           | Derivable only after command-node identity and state rules are stable. |
| `idleReadyCount`        | `number`         | `NEW CONTRACT NEEDED` | No current authoritative rule.                                         |
| `awaitingApprovalCount` | `number`         | `NEW CONTRACT NEEDED` | No request ledger or ratified rollup source today.                     |
| `blockedCount`          | `number`         | `NEW CONTRACT NEEDED` | No normalized blocker contract today.                                  |
| `degradedCount`         | `number`         | `NEW CONTRACT NEEDED` | No current degraded-state contract.                                    |
| `staleCount`            | `number`         | `PROJECTED`           | Possible only after stale thresholds are ratified.                     |
| `missingTelemetryCount` | `number`         | `NEW CONTRACT NEEDED` | Needs authoritative expected-roster vs observed-telemetry logic.       |
| `offlineCount`          | `number`         | `PROJECTED`           | Requires roster contract plus presence absence rules.                  |
| `queueDepth`            | `number`         | `NEW CONTRACT NEEDED` | No existing queue metric.                                              |
| `lastReceiptAt`         | `string \| null` | `NEW CONTRACT NEEDED` | Repo has receipt concepts in docs, but no cockpit-ready API surface.   |
| `failedGatesCount`      | `number`         | `NEW CONTRACT NEEDED` | No current gate-result rollup contract.                                |

#### `WorkforceAlphaCommandTreeNode`

| Field                                          | Type                 | Status                | Source / note                                                                                         |
| ---------------------------------------------- | -------------------- | --------------------- | ----------------------------------------------------------------------------------------------------- |
| `nodeId`                                       | `string`             | `PROJECTED`           | Can likely map to agent ids from `agents.list`, but that mapping is not ratified for Workforce Alpha. |
| `displayName`                                  | `string`             | `PROJECTED`           | Available in agent or node identity surfaces once mapping exists.                                     |
| `roleLabel`                                    | `string`             | `NEW CONTRACT NEEDED` | No role taxonomy today.                                                                               |
| `reportsTo`                                    | `string \| null`     | `NEW CONTRACT NEEDED` | No hierarchy edge contract exists.                                                                    |
| `state`                                        | `WorkforceNodeState` | `PROJECTED`           | Requires a ratified state projector over presence/sessions/health.                                    |
| `currentJobLabel`                              | `string \| null`     | `PROJECTED`           | Could be approximated from session labels or cron runs, but not normalized yet.                       |
| `startedAt`                                    | `string \| null`     | `NEW CONTRACT NEEDED` | `sessions.list` has `updatedAt`, not a true job start.                                                |
| `ageSeconds`                                   | `number \| null`     | `NEW CONTRACT NEEDED` | Depends on a real start time.                                                                         |
| `lastHeartbeatAt`                              | `string \| null`     | `PROJECTED`           | Can be approximated from presence timestamps or node connection timestamps.                           |
| `lastArtifactRef`                              | `string \| null`     | `NEW CONTRACT NEEDED` | No normalized artifact reference exists.                                                              |
| `modelName`                                    | `string \| null`     | `PROJECTED`           | Seedable from sessions/usage.                                                                         |
| `providerName`                                 | `string \| null`     | `PROJECTED`           | Seedable from sessions/usage.                                                                         |
| `tokenUsage`                                   | `number \| null`     | `PROJECTED`           | Seedable from sessions/usage.                                                                         |
| `contextUsage`                                 | `number \| null`     | `PROJECTED`           | Seedable from session context tokens / usage context weight.                                          |
| `trustState` / `sourceKinds` / `missingFields` | envelope fields      | `NEW CONTRACT NEEDED` | Mandatory for V2 honesty.                                                                             |

#### `WorkforceAlphaEvidenceRail`

| Field                     | Type                          | Status                | Source / note                                                                                     |
| ------------------------- | ----------------------------- | --------------------- | ------------------------------------------------------------------------------------------------- |
| `manifestConfigPath`      | `string \| null`              | `VERIFIED`            | Seedable from `config.get.path`.                                                                  |
| `manifestValid`           | `boolean \| null`             | `VERIFIED`            | Seedable from `config.get.valid`.                                                                 |
| `manifestIssues`          | `ConfigSnapshotIssue[]`       | `VERIFIED`            | Seedable from `config.get.issues`.                                                                |
| `contractGapItems`        | `WorkforceAlphaContractGap[]` | `NEW CONTRACT NEEDED` | Today they live in planning artifacts, not runtime API output.                                    |
| `receiptCoverageSummary`  | `string \| null`              | `NEW CONTRACT NEEDED` | No current runtime rollup.                                                                        |
| `latestGateResult`        | `string \| null`              | `NEW CONTRACT NEEDED` | No current gate-result contract.                                                                  |
| `sessionEvidenceCoverage` | `string \| null`              | `NEW CONTRACT NEEDED` | No current rollup contract.                                                                       |
| `lineageNotes`            | `string[]`                    | `NEW CONTRACT NEEDED` | No current lineage DTO.                                                                           |
| `telemetryTrustNotes`     | `string[]`                    | `NEW CONTRACT NEEDED` | No current trust-note DTO.                                                                        |
| `branchRef`               | `string \| null`              | `NEW CONTRACT NEEDED` | Optional only if a legitimate runtime source exists; do not normalize from build-time repo state. |
| `prRef`                   | `string \| null`              | `NEW CONTRACT NEEDED` | Same rule as above.                                                                               |
| `approvalPolicy`          | object                        | `PROJECTED`           | Could reuse parts of `exec.approvals.*`, but needs a cockpit-facing summary contract.             |

### 2. `workforce.alpha.execution.list`

Purpose: return the normalized `Execution Feed`.

- VERIFIED CURRENT STATE: the sibling `sprytly-internal-dashboard` backend now exposes an authenticated transitional REST facade at `GET /api/mission-control/workforce/alpha/execution`.
- TARGET ARCHITECTURE: the route returns `contractVersion: mission-control.workforce-alpha.execution.v1`, normalized feed rows, additive `runId` / `sessionKey` fields, and explicit `missingFields` when outcome, artifact, escalation, or runtime identifiers are not honestly available.
- TO VERIFY / UNCONFIRMED: the current route still uses a REST-local cursor and often projects from session activity because the local `activity_events` seam may be empty.

Request:

```ts
type WorkforceAlphaExecutionListParams = {
  nodeId?: string;
  limit?: number;
  cursor?: string;
};
```

Response:

```ts
type WorkforceAlphaExecutionListResult = {
  generatedAt: string;
  items: WorkforceAlphaExecutionEvent[];
  nextCursor?: string | null;
};
```

#### `WorkforceAlphaExecutionEvent`

| Field                        | Type                        | Status                | Source / note                                                                           |
| ---------------------------- | --------------------------- | --------------------- | --------------------------------------------------------------------------------------- |
| `eventId`                    | `string`                    | `NEW CONTRACT NEEDED` | Generic event/log surfaces do not expose stable Workforce event ids.                    |
| `eventAt`                    | `string`                    | `PROJECTED`           | Seedable from event/log timestamps.                                                     |
| `actorNodeId`                | `string`                    | `NEW CONTRACT NEEDED` | Current generic events do not guarantee a Workforce actor id.                           |
| `actorDisplayName`           | `string`                    | `NEW CONTRACT NEEDED` | Depends on actor mapping.                                                               |
| `eventType`                  | `string`                    | `PROJECTED`           | Could normalize from gateway event names, cron status entries, or queued system events. |
| `eventSummary`               | `string`                    | `PROJECTED`           | Possible via server-side summarization; not emitted today.                              |
| `outcome`                    | `WorkforceExecutionOutcome` | `NEW CONTRACT NEEDED` | No current normalized success/stall/escalation enum.                                    |
| `artifactRef`                | `string \| null`            | `NEW CONTRACT NEEDED` | No current artifact reference field.                                                    |
| `escalationTarget`           | `string \| null`            | `NEW CONTRACT NEEDED` | No current escalation contract.                                                         |
| `reason`                     | `string \| null`            | `PROJECTED`           | Some logs/events may carry reason text, but not uniformly.                              |
| `trustState` / `sourceKinds` | envelope fields             | `NEW CONTRACT NEEDED` | Required for honest feed rendering.                                                     |

### 3. `workforce.alpha.inspector.get`

Purpose: return the `Inspector Drawer` drill-down for a selected node and its latest known execution context.

- VERIFIED CURRENT STATE: the sibling `sprytly-internal-dashboard` backend now exposes an authenticated transitional REST facade at `GET /api/mission-control/workforce/alpha/inspector?nodeId=...`.
- TARGET ARCHITECTURE: the route returns `contractVersion: mission-control.workforce-alpha.inspector.v1`, the selected normalized command-tree node, session-preview detail, projected `lastToolCall`, `metricTrustSources`, and explicit `missingFields` for unadmitted artifact, receipt, branch, PR, and governance seams.
- TO VERIFY / UNCONFIRMED: artifact/receipt linkage, governance flags, and several provenance fields still remain future contract work even though the drill-down route now exists.

Request:

```ts
type WorkforceAlphaInspectorGetParams = {
  nodeId: string;
};
```

Response:

```ts
type WorkforceAlphaInspectorResult = {
  generatedAt: string;
  node: WorkforceAlphaCommandTreeNode;
  detail: WorkforceAlphaInspectorDetail;
};
```

#### `WorkforceAlphaInspectorDetail`

| Field                | Type                                                                               | Status                | Source / note                                                                                                   |
| -------------------- | ---------------------------------------------------------------------------------- | --------------------- | --------------------------------------------------------------------------------------------------------------- |
| `runId`              | `string \| null`                                                                   | `PROJECTED`           | Repo evidence shows `runId` in agent-event and receipt contexts, but not as a cockpit-ready inspector contract. |
| `jobId`              | `string \| null`                                                                   | `PROJECTED`           | `cron.runs` proves a job id for cron contexts only; not a general Workforce job contract.                       |
| `sessionKey`         | `string \| null`                                                                   | `PROJECTED`           | Seedable from sessions and cron-run data once node mapping exists.                                              |
| `sessionPreview`     | object \| null                                                                     | `PROJECTED`           | `sessions.preview` is a real drill-down source, but not yet normalized for Workforce.                           |
| `workspaceRef`       | `string \| null`                                                                   | `PROJECTED`           | Agent/workspace file inspection exists, but not as a stable Workforce inspector field.                          |
| `lastToolCall`       | `string \| null`                                                                   | `NEW CONTRACT NEEDED` | No normalized tool-call summary surface today.                                                                  |
| `artifactLinks`      | `Array<{ label: string; href: string }>`                                           | `NEW CONTRACT NEEDED` | No normalized artifact-link DTO.                                                                                |
| `receiptLinks`       | `Array<{ label: string; href: string }>`                                           | `NEW CONTRACT NEEDED` | No normalized receipt-link DTO.                                                                                 |
| `branchRef`          | `string \| null`                                                                   | `NEW CONTRACT NEEDED` | Only if legitimately available at runtime.                                                                      |
| `prRef`              | `string \| null`                                                                   | `NEW CONTRACT NEEDED` | Same rule as above.                                                                                             |
| `logsTraceRef`       | `string \| null`                                                                   | `PROJECTED`           | Logs can support a trace seed, but no inspector-grade reference exists yet.                                     |
| `governanceFlags`    | `string[]`                                                                         | `NEW CONTRACT NEEDED` | No current governance-flag DTO.                                                                                 |
| `metricTrustSources` | `Array<{ field: string; trustState: WorkforceTrustState; sourceKinds: string[] }>` | `NEW CONTRACT NEEDED` | This is the core drill-down provenance contract.                                                                |

## Data flow

1. Gateway bootstrap loads `ControlUiBootstrapConfig` for shell identity and base path.
2. A new Workforce Alpha projector inside the gateway assembles generic sources:
   - `agents.list` / `agent.identity.get`
   - `system-presence`
   - `sessions.list`
   - `sessions.usage`
   - `node.list`
   - `cron.status` / `cron.runs`
   - `health`
   - `config.get`
   - `exec.approvals.*`
   - `logs.tail`, queued system events, and selected websocket event-buffer signals where appropriate
3. The projector applies the authoritative Workforce hierarchy and state-derivation rules.
4. The projector emits normalized Workforce DTOs with trust/provenance and explicit `missingFields`.
5. The UI renders those DTOs directly and reserves generic-controller fan-out only for transitional shell/placeholder behavior.

## Truth and provenance handling

- `observed`: value came directly from one verified runtime/config source without semantic projection.
- `projected`: value was derived from multiple verified generic sources or inferred through ratified projector rules.
- `manifest_only`: value came from a declared manifest/config source but not live runtime observation.
- `missing`: no truthful value is currently available.

Required contract behavior:

- each major object must expose `trustState`
- each projected field must list `sourceKinds`
- each missing field must list a human-readable reason
- the UI must be able to render the reason without inventing fallback values

Uniform trust/provenance emission is itself `NEW CONTRACT NEEDED`.

## Minimum implementation-planning outcome from this lane

### Already grounded enough to plan against

- Keep the current transport model as Gateway WebSocket RPC.
- Keep the existing `overview` route as the safest first mount point for the cockpit shell.
- Reuse the proven generic sources above for shell framing and projected placeholders only.

### Still `NEW CONTRACT NEEDED` before full V2 truth

- canonical Workforce hierarchy and `reports_to`
- ratified operator-state projector and ops-strip rollups
- evidence-rail rollups beyond raw config/approvals
- inspector artifact/receipt/branch/PR/governance linkage
- long-term uniform trust/provenance envelopes for the eventual Gateway RPC transport

## Recommended delivery order after this lane

1. Keep the landed snapshot / execution / inspector REST facades stable while frontend work begins.
2. Build the cockpit shell against the admitted contracts and render unresolved fields through `trustState` and `missingFields`, not invented UI truth.
3. Tighten the authoritative hierarchy contract and ops-strip rollups only when stronger backend evidence is admitted.
4. Add artifact, receipt, branch, PR, and governance linkage after the first frontend slice proves which gaps actually block operators.

## One bounded next action after this lane

Start Workforce Alpha V2 Implementation - Frontend Development: UI Components by commencing the UI implementation against the now-complete ratified Workforce Alpha backend API surface while preserving trustState and missingFields honesty.
