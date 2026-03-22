# CHARRETTE_OUTPUT

## A) VERIFIED CURRENT STATE

### Reconnaissance summary

- `ops/missions/openclaw-governance/continuity-system-v1/LANDED_STATE_INDEX.md` is the only tracked file that explicitly names the claimed Workforce Alpha V1 surface, and it records `GET /api/mission-control/workforce/alpha`, `/mission-control/workforce/alpha`, and `MissionControlWorkforceAlphaPage.jsx` as an external baseline rather than repo-local implementation.
- `ops/missions/openclaw-governance/continuity-system-v1/RECEIPTS_INDEX.md` and `ops/missions/openclaw-governance/continuity-system-v1/05_KICKOFF_STATE.md` also treat Mission 2 as external and note the pre-existing untracked `ops/missions/cnv-mission-2-mission-control-ui/` path.
- `git ls-files` does not show a tracked repo-local Workforce Alpha implementation under obvious names such as `WorkforceAlpha`, `mission-control/workforce/alpha`, or `MissionControlWorkforceAlphaPage`.
- The tracked repo does establish adjacent but generic control-plane surfaces in `docs/web/control-ui.md`, `src/commands/dashboard.ts`, and `src/gateway/control-ui-contract.ts`, plus an unrelated Strike Team Alpha operational note in `docs/cyborgclaw/SSOT.md`.
- Conclusion: the current Workforce Alpha V1 page, route, and data surfaces remain `TO VERIFY / UNCONFIRMED` in tracked repo artifacts. This section critiques the redesign pressure truthfully from that starting point.

### What appears worth preserving from V1 or its design intent

- The browser-first control plane model: Gateway-served SPA, direct WebSocket connection, and `openclaw dashboard` as the fast entry point.
- The security posture: token handling, device pairing, and the local-versus-remote distinction.
- The operational utility surface: chat, sessions, config, logs, cron, updates, node/status views, and schema/forms.
- The intent to provide one control surface instead of a pile of disconnected tools.

### Problem-by-problem critique

#### 1) Voltaris missing

- VERIFIED CURRENT STATE: The repo proves Voltaris as mission ownership context in governance artifacts, but it does not prove a tracked Workforce Alpha page that visibly anchors Voltaris in the page itself.
- TARGET ARCHITECTURE: The first screen should read as a Voltaris-owned operator console, with command ownership visible immediately instead of implied by external docs.
- TO VERIFY / UNCONFIRMED: Whether the external baseline page already includes Voltaris-branded copy, operator framing, or sponsor identity in its header.

#### 2) Page starts with meta cards instead of command hierarchy

- VERIFIED CURRENT STATE: No tracked Workforce Alpha page implementation is present to inspect; the local UI artifacts are capability-first docs and launcher plumbing, not a proven command-first page structure.
- TARGET ARCHITECTURE: The page should begin with command hierarchy and operator decisions first, then supporting metadata.
- TO VERIFY / UNCONFIRMED: Whether the external baseline literally opens with mission/meta cards and, if so, which cards appear before the operator's first decision point.

#### 3) "Not working" conflates states

- VERIFIED CURRENT STATE: The tracked repo does not prove any Workforce Alpha page-state taxonomy. The local Control UI material only shows broad capability surfaces and bootstrap config, not a nuanced operational-state model.
- TARGET ARCHITECTURE: Failure and inactivity should be split into explicit states such as `Active`, `Idle-ready`, `Awaiting approval`, `Blocked`, `Degraded`, `Stale`, `Missing telemetry`, and `Offline` only when truly known.
- TO VERIFY / UNCONFIRMED: Whether the external baseline currently collapses multiple conditions into one undifferentiated "not working" label.

#### 4) Live, static, governance, and evidence are visually blended

- VERIFIED CURRENT STATE: The repo already separates governance artifacts from generic UI docs at the file level, but there is no tracked page evidence showing visual separation between live signals, static references, governance decisions, and evidence.
- TARGET ARCHITECTURE: The page should use distinct bands and visual grammar so live telemetry, static reference, governance, and evidence can be read at a glance without collapsing into one card wall.
- TO VERIFY / UNCONFIRMED: Whether the external baseline currently mixes these concerns into one card stack or one repeated visual treatment.

#### 5) Roster, topology, and telemetry do not feel like one system

- VERIFIED CURRENT STATE: The local Control UI docs expose nodes, sessions, status, logs, and config as separate capabilities, but there is no tracked Workforce Alpha surface proving a unified roster, topology, and telemetry model.
- TARGET ARCHITECTURE: V2 should present roster, topology, and telemetry as one system: who is present, where they sit in the chain of command, what they are doing, and how healthy their evidence trail is.
- TO VERIFY / UNCONFIRMED: The actual entity model used by the external baseline, and whether it already links those layers or keeps them separate.

#### 6) The page fails the 5-second operator questions

- VERIFIED CURRENT STATE: The tracked repo does not prove a local page that answers the operator's first questions; the closest local evidence is generic Control UI launcher and bootstrap behavior.
- TARGET ARCHITECTURE: The first viewport should answer: who is in charge, who is doing work, what is blocked, what proof exists, and whether intervention is needed now.
- TO VERIFY / UNCONFIRMED: Which of those questions the external baseline answers today, and in what order.

## B) DESIGN CHARRETTE

### Section framing

- VERIFIED CURRENT STATE: These are simulated stakeholder voices grounded in the mission brief, the non-negotiable page model, and the section A critique. They are not claims about proven runtime behavior or backend contracts.
- TARGET ARCHITECTURE: All four voices converge on the same V2 direction: command-first layout, explicit state taxonomy, visible evidence boundaries, and a unified operating surface.
- TO VERIFY / UNCONFIRMED: The exact external baseline V1 page may still contain behaviors or structures not proven in tracked repo artifacts, so these voices should shape concepts rather than override missing evidence.

### Cross-voice alignment

- Chain of command must be the first visual story, with Voltaris V2 at the top, President-A directly beneath, and Strike Team Alpha agents below.
- The page must answer the five-second operator questions immediately: who is in charge, who is working, what is blocked, what proof exists, and whether intervention is needed.
- "Not working" is rejected by every voice; V2 needs explicit operational and trust states instead of a vague failure bucket.
- Live telemetry, static structure, governance, and evidence must stop sharing one visual treatment.
- Roster, topology, telemetry, and execution activity must read as one coherent control surface rather than disconnected widgets.

### Commander / operator voice

#### What I care about most in V2

- Instant command clarity: Voltaris V2 at the top, President-A directly beneath, then Strike Team Alpha.
- Five-second operational answers: who is in charge, who is actively working, what is blocked, what proof exists, and whether intervention is needed now.
- A page that supports decisions first and information second.

#### What I hate in V1

- The chain of command is hidden behind meta cards instead of leading the page.
- "Not working" is an empty bucket that hides useful operational distinctions.
- Live status, governance, evidence, and structure feel fragmented instead of like one system.

#### What I demand in V2

- Put the command hierarchy first, not last.
- Make live ops, governance, and evidence readable as separate layers.
- Make the roster, topology, telemetry, and execution feed work together as one operational decision surface.

### SRE / observability voice

#### What I care about most in V2

- The page must tell the truth fast: who is in charge, what is actually active, what is blocked, and what proof backs that up.
- Command precedence matters diagnostically, so Voltaris V2 and President-A need to be unmistakable.
- Live telemetry, governance state, and evidence need clear separation so the operator can trust what they are reading.

#### What I hate in V1

- Command hierarchy is visually buried, so the page feels ambiguous before it feels operational.
- "Not working" collapses failure, trust, and verification states into one misleading label.
- Roster, topology, telemetry, and governance read like unrelated fragments instead of one diagnostic path.

#### What I demand in V2

- Start with the Command Canopy and make the chain of command explicit.
- Keep the Live Ops Strip, Execution Feed, Evidence + Governance Rail, and Inspector Drawer visually and semantically distinct.
- Answer honestly, and immediately, who is leading, who is working, what is blocked, what evidence exists, and whether intervention is needed.

### Governance / audit voice

#### What I care about most in V2

- Clean authority, honest state, and auditability.
- Visible separation of `VERIFIED CURRENT STATE`, `TARGET ARCHITECTURE`, and `TO VERIFY / UNCONFIRMED`.
- A page that lets governance understand command, evidence, and trust without inference.

#### What I hate in V1

- The command chain is hidden behind meta cards, which is backwards for governance.
- Live, static, governance, and evidence signals are blended into one visual soup.
- Voltaris is missing, President-A is not established as direct chain-of-command context, and the system does not read as traceable.

#### What I demand in V2

- A command-first layout built around `Command Canopy`, `Live Ops Strip`, `Chain of Command Tree`, `Execution Feed`, `Evidence + Governance Rail`, and `Inspector Drawer`.
- Traceable trust labels on every key state.
- No inferred truth presented as confirmed and no blurred boundary between governance signals and live telemetry.

### UX systems designer voice

#### What I care about most in V2

- The page should answer the operator's first five-second questions without forcing visual search.
- The visual order must be command-first: Voltaris V2, then President-A, then Strike Team Alpha agents.
- The page must feel like one coherent operating surface instead of separate islands for roster, topology, telemetry, governance, and evidence.

#### What I hate in V1

- It starts with meta cards instead of command hierarchy.
- "Not working" is doing too much work; state, risk, blockage, and trust need to be explicit.
- Live, static, governance, and evidence are visually blended, which makes the page noisy and hard to trust.
- The page feels stitched together rather than composed around one operational narrative.

#### What I demand in V2

- Build around the mandatory model: `Command Canopy`, `Live Ops Strip`, `Chain of Command Tree`, `Execution Feed`, `Evidence + Governance Rail`, and `Inspector Drawer`.
- Put hierarchy first, then operations, then evidence, with progressive disclosure for detail.
- Preserve the dark neon identity, but optimize for readability, scanning, and visual coherence over decorative card sprawl.

## C) 3 COMPETING V2 CONCEPTS

### Section framing

- VERIFIED CURRENT STATE: These concepts are target-architecture options generated from sections A and B. They do not claim any additional runtime truth about the current Workforce Alpha V1 surface.
- TARGET ARCHITECTURE: All three concepts obey the same command-first spine and mandatory page model, but they differ in which operator need they optimize for first: speed, decision lineage, or evidence confidence.
- TO VERIFY / UNCONFIRMED: Any later concept selection must still respect that the underlying V1 route, component tree, and exact data contract remain unproven in tracked repo artifacts.

### Comparative read

- `Command Cockpit` optimizes for fastest five-second operational scan.
- `Decision Lattice` optimizes for decision lineage and ownership clarity across the chain of command.
- `Evidence-First Operations Desk` optimizes for trust posture, auditability, and proof-backed operations.

### Concept 1: Command Cockpit

#### Layout idea

- A dense but restrained control surface.
- `Voltaris V2` sits in the top command canopy, with `President-A` directly below as the immediate command owner.
- Strike Team Alpha agents appear in a compact chain-of-command tree that is visually secondary to the live operational surface.
- The center of the page is driven by the Live Ops Strip plus Execution Feed, while a fixed Evidence + Governance Rail sits at the right and the Inspector Drawer opens from the side or bottom.

#### Strengths

- Fastest concept for the five-second operator questions.
- Keeps command hierarchy obvious without turning the page into an org-chart poster.
- The Live Ops Strip and Execution Feed create strong operational momentum.
- Evidence and governance remain visible even while the page emphasizes live action.

#### Weaknesses

- Risks feeling busy if too many live metrics are surfaced at once.
- Less forgiving for users who want to study the chain of command in depth.
- The Execution Feed can compete visually with hierarchy if not tightly controlled.

#### Operator tradeoffs

- Best when operators need rapid situational awareness and immediate escalation paths.
- Trades some structural elegance for speed and scanability.
- Optimized for `What is the current command state?` over `How is the full system organized?`

### Concept 2: Decision Lattice

#### Layout idea

- A layered decision surface where the command tree is the spine, but each layer expands into operational context instead of reading as raw hierarchy.
- `Voltaris V2` anchors the top canopy, `President-A` sits directly beneath, and Strike Team Alpha agents branch below in a compact readable tree.
- The Live Ops Strip runs horizontally between command layers and execution activity.
- The Evidence + Governance Rail is persistent, and the Inspector Drawer handles detail-on-demand rather than constant attention.

#### Strengths

- Best at connecting authority to action, so operators can see who owns a decision and how it propagates.
- Supports drill-down without losing the chain of command.
- Strong fit for a command-first product that still needs evidence boundaries and operational clarity.
- Reduces the org-chart feel by making hierarchy functional instead of decorative.

#### Weaknesses

- Slightly slower to scan than a pure cockpit because the user is reading relationships, not just status.
- More dependent on strong grouping and visual discipline.
- Live telemetry is present, but not the dominant visual force.

#### Operator tradeoffs

- Best for operators who care about decision lineage and accountability.
- Trades immediacy for clearer cause-and-effect across the command structure.
- Optimized for `Who controls this, and what did that control produce?`

### Concept 3: Evidence-First Operations Desk

#### Layout idea

- A governed operations desk where trust and proof are as visible as command.
- `Voltaris V2` is at the top of the Command Canopy, `President-A` sits directly beneath, and Strike Team Alpha agents appear below in a compact command tree.
- The Live Ops Strip is slimmer and more restrained.
- The Execution Feed is paired tightly with the Evidence + Governance Rail so each action is framed by visible proof boundaries.
- The Inspector Drawer is the primary detail surface for checking operator context, not just state.

#### Strengths

- Strongest posture for trust, auditability, and operator confidence.
- Makes it hard to confuse system state with verified state.
- Evidence boundaries remain in view, which helps when operators need to know what is confirmed versus uncertain.
- Good fit when governance matters as much as operational speed.

#### Weaknesses

- Less visually energetic than the other concepts.
- May feel heavier for operators who mainly want fast status and quick action.
- The evidence emphasis can reduce the perceived prominence of live telemetry.

#### Operator tradeoffs

- Best when trust, traceability, and confirmation discipline matter most.
- Trades some speed and visual lightness for stronger operational confidence.
- Optimized for `What do we know, how do we know it, and who owns it?`

## D) SELECTED DIRECTION

### Section framing

- VERIFIED CURRENT STATE: `Command Cockpit`, `Decision Lattice`, and `Evidence-First Operations Desk` are the three frozen concepts from section C. The winner must be selected from that set, not replaced by a blended fourth option.
- TARGET ARCHITECTURE: `Command Cockpit` is the selected direction because it best preserves the command-first spine while still supporting live telemetry, governance visibility, and drill-down inspection.
- TO VERIFY / UNCONFIRMED: The exact external-baseline V1 surface is still unproven in tracked repo artifacts, so this selection is based on the charrette brief and frozen concept analysis rather than new runtime evidence.

### Winning concept

- `Command Cockpit`

### Why it wins for CyborgClaw

- It fits a command-and-telemetry control surface better than the other two concepts because it centers the chain of command first without sacrificing operational velocity.
- It maps cleanly onto the mandatory page model: `Command Canopy` for Voltaris V2, President-A, and Strike Team Alpha; `Live Ops Strip` for fast operational state; `Execution Feed` for current motion; `Evidence + Governance Rail` for trust and provenance; and `Inspector Drawer` for drill-down.
- It best satisfies the five-second operator test. The operator should be able to see who is in charge, what is happening now, what is blocked, what proof exists, and whether intervention is needed before reading any deep structure.
- It keeps the dark neon CyborgClaw identity viable without letting visual style outrun readability or operational clarity.

### Why the other two do not win

#### Decision Lattice

- Strong on lineage and accountability, but it reads as a relationship-logic model before it reads as a command surface.
- It risks shifting the page toward structural explanation instead of immediate operational command clarity.
- For CyborgClaw, that is one step too abstract for the first screen.

#### Evidence-First Operations Desk

- Strongest on proof and governance, but it lets evidence become the dominant frame instead of command hierarchy.
- It risks making the page feel like an audit desk with command attached instead of an operational cockpit with evidence attached.
- For CyborgClaw, that is the wrong primary emphasis for the first read.

### Selection risks to watch

- Do not overbuild `Command Cockpit` into a dense control room.
- Do not let the hierarchy sprawl into a giant org-chart poster.
- Keep the Live Ops Strip and Execution Feed scannable; they must not drown the Command Canopy.
- Keep the Evidence + Governance Rail secondary but always visible.
- Preserve the dark neon identity without letting ornament slow down the operator's first read.

## E) WIREFRAME

- VERIFIED CURRENT STATE: `Command Cockpit` is the selected direction from section D, and the detailed target wireframe now lives in `V2_WIREFRAME.md`.
- TARGET ARCHITECTURE: The wireframe freezes a desktop-first three-column command cockpit with a dominant canopy, a triage strip, a readable command tree, a live execution stream, a persistent evidence rail, and a deep-detail inspector drawer.
- TO VERIFY / UNCONFIRMED: Any metric, relationship, or event field not proven in tracked repo artifacts remains labeled `TO VERIFY / UNCONFIRMED` inside the wireframe rather than being treated as live truth.
- Reference artifact: `V2_WIREFRAME.md`

## F) TELEMETRY CONTRACT MAP

### Section framing

- VERIFIED CURRENT STATE: Tracked repo artifacts prove a generic browser Control UI plus a very small bootstrap config contract, not a Workforce Alpha-specific telemetry model. The only exact field names proven in tracked code are `basePath`, `assistantName`, `assistantAvatar`, `assistantAgentId`, `serverVersion?`, plus protocol identifiers such as `runId` and `sessionKey` in documented Control UI flows and the documented config path `~/.openclaw/openclaw.json`.
- TARGET ARCHITECTURE: Workforce Alpha V2 needs a telemetry contract that distinguishes raw repo-proven control-plane fields from derived command-surface fields, governance rollups, and explicit trust-state synthesis required by `Command Cockpit`.
- TO VERIFY / UNCONFIRMED: The tracked repo still does not prove a repo-local Workforce Alpha V1 page, route, or section-specific data contract. Any field below that depends on command hierarchy, Alpha-team semantics, or UI rollups must stay `TO VERIFY` or `NEW FIELD NEEDED`.

### 1. Command Canopy

| Field                             | Status             | Note                                                                                                                  |
| --------------------------------- | ------------------ | --------------------------------------------------------------------------------------------------------------------- |
| `assistant_name`                  | `EXISTING`         | Exact bootstrap field `assistantName` is proven in `src/gateway/control-ui-contract.ts`.                              |
| `assistant_avatar`                | `EXISTING`         | Exact bootstrap field `assistantAvatar` is proven in `src/gateway/control-ui-contract.ts`.                            |
| `assistant_agent_id`              | `EXISTING`         | Exact bootstrap field `assistantAgentId` is proven in `src/gateway/control-ui-contract.ts`.                           |
| `voltaris_display_name`           | `TO VERIFY`        | Leadership display identity beyond the generic assistant bootstrap shell is not proven as a Workforce Alpha contract. |
| `president_a_display_name`        | `TO VERIFY`        | Required by the charrette, but not proven in tracked repo data surfaces.                                              |
| `current_mission_label`           | `TO VERIFY`        | Plausibly derivable from session/chat context, but no exact field is proven.                                          |
| `last_orchestration_event_label`  | `TO VERIFY`        | Generic activity/event surfaces exist, but not an exact canopy field.                                                 |
| `active_run_count`                | `TO VERIFY`        | May be derivable from session/run surfaces, but the exact payload shape is unproven.                                  |
| `approvals_pending_count`         | `TO VERIFY`        | Approval surfaces exist (`exec.approvals.*`), but this rollup count is not explicitly proven.                         |
| `stale_or_downstream_issue_count` | `NEW FIELD NEEDED` | Requires command-health aggregation semantics not proven in the tracked Control UI contract.                          |
| `command_connector_relationship`  | `NEW FIELD NEEDED` | The explicit `Voltaris V2 -> President-A` canopy relationship is a new command-model requirement.                     |
| `canopy_trust_state`              | `NEW FIELD NEEDED` | The canopy needs a synthesized trust label, not a currently proven raw field.                                         |

### 2. Live Ops Strip

| Field                     | Status             | Note                                                                                            |
| ------------------------- | ------------------ | ----------------------------------------------------------------------------------------------- |
| `active_count`            | `TO VERIFY`        | Likely derivable from session or node activity surfaces, but not proven as a direct field.      |
| `idle_ready_count`        | `NEW FIELD NEEDED` | The charrette taxonomy requires an explicit `Idle-ready` state not proven in tracked artifacts. |
| `awaiting_approval_count` | `TO VERIFY`        | Approval APIs exist, but this exact UI rollup field is not proven.                              |
| `blocked_count`           | `NEW FIELD NEEDED` | `Blocked` is required as an explicit operator state, but no repo-backed rollup is proven.       |
| `stale_count`             | `NEW FIELD NEEDED` | Requires a defined stale heuristic over heartbeats/events that is not proven.                   |
| `missing_telemetry_count` | `NEW FIELD NEEDED` | Requires a missing-data classifier, not a currently proven field.                               |
| `queue_depth`             | `NEW FIELD NEEDED` | No queue-depth field or queue contract is proven in tracked Workforce Alpha artifacts.          |
| `last_receipt_at`         | `NEW FIELD NEEDED` | Receipt timing is important to the charrette but not proven in current Control UI contracts.    |
| `failed_gates_count`      | `NEW FIELD NEEDED` | The page needs gate-failure rollups that are not explicitly exposed today.                      |
| `ops_strip_trust_state`   | `NEW FIELD NEEDED` | The strip requires a synthesized trust layer across all rollups.                                |

### 3. Chain of Command Tree (per node)

| Field                | Status             | Note                                                                                                                 |
| -------------------- | ------------------ | -------------------------------------------------------------------------------------------------------------------- |
| `node_id`            | `TO VERIFY`        | Generic node/session identifiers likely exist, but exact per-node contract fields are not proven.                    |
| `display_name`       | `TO VERIFY`        | A node-facing label is likely available somewhere, but the exact field is unproven.                                  |
| `role_label`         | `NEW FIELD NEEDED` | The charrette needs command-role semantics (`Voltaris V2`, `President-A`, Alpha agent) beyond generic node metadata. |
| `reports_to_node_id` | `NEW FIELD NEEDED` | Required for explicit authority connectors; not proven in tracked repo surfaces.                                     |
| `operating_state`    | `NEW FIELD NEEDED` | The mandatory state taxonomy is more specific than any proven generic status contract.                               |
| `current_job_label`  | `TO VERIFY`        | Run/session activity may expose this, but no exact field is proven.                                                  |
| `started_at`         | `TO VERIFY`        | Timing may exist in session/run surfaces, but exact field names are unproven.                                        |
| `last_heartbeat_at`  | `TO VERIFY`        | `system-presence` implies heartbeat/presence concepts, but not exact fields.                                         |
| `last_artifact_ref`  | `TO VERIFY`        | Artifact/event surfaces likely exist, but not as a proven node field.                                                |
| `model_name`         | `TO VERIFY`        | Model metadata is likely available through chat/session/config flows, but not proven per node.                       |
| `provider_name`      | `TO VERIFY`        | Same as model metadata: plausible, not proven as a node contract field.                                              |
| `token_usage`        | `TO VERIFY`        | Useful for the tree, but exact token-usage fields are not proven in tracked artifacts.                               |
| `context_usage`      | `TO VERIFY`        | Same boundary as `token_usage`.                                                                                      |
| `trust_badge`        | `NEW FIELD NEEDED` | `Observed`, `Projected`, `Manifest-only`, and `Missing` are UI synthesis states, not proven raw fields.              |

### 4. Execution Feed (per event)

| Field                   | Status             | Note                                                                                      |
| ----------------------- | ------------------ | ----------------------------------------------------------------------------------------- |
| `event_id`              | `TO VERIFY`        | Generic activity streams exist, but an exact feed event identifier is not proven.         |
| `event_at`              | `TO VERIFY`        | A timestamp is likely available, but the exact field is unproven.                         |
| `actor_node_id`         | `TO VERIFY`        | Needed for filtering and attribution, but not proven in a Workforce Alpha event contract. |
| `actor_display_name`    | `TO VERIFY`        | Useful for scanability, but exact event payload shape is unproven.                        |
| `event_type`            | `TO VERIFY`        | Chat/tool/event streams imply types, but exact type fields are not frozen here.           |
| `event_summary`         | `TO VERIFY`        | High-signal feed text is likely derivable, not proven as an existing exact field.         |
| `artifact_or_event_ref` | `TO VERIFY`        | Needed by the feed, but exact artifact reference fields are unproven.                     |
| `outcome_state`         | `NEW FIELD NEEDED` | `Succeeded`, `stalled`, and `escalated` need a normalized event-outcome taxonomy.         |
| `run_id`                | `EXISTING`         | `chat.send` explicitly documents `runId` in its ack contract.                             |
| `session_key`           | `EXISTING`         | `chat.abort` explicitly documents `sessionKey` in Control UI flows.                       |
| `escalation_target`     | `NEW FIELD NEEDED` | Escalation routing is required by the charrette but not proven today.                     |
| `event_trust_state`     | `NEW FIELD NEEDED` | Feed trust labeling must be synthesized from source provenance.                           |

### 5. Evidence + Governance Rail

| Field                       | Status             | Note                                                                                                                                             |
| --------------------------- | ------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| `config_source_path`        | `EXISTING`         | `docs/web/control-ui.md` explicitly names `~/.openclaw/openclaw.json` as the config surface.                                                     |
| `base_path`                 | `EXISTING`         | Exact bootstrap field `basePath` is proven in `src/gateway/control-ui-contract.ts`.                                                              |
| `server_version`            | `EXISTING`         | Exact bootstrap field `serverVersion?` is proven in `src/gateway/control-ui-contract.ts`.                                                        |
| `manifest_config_source`    | `TO VERIFY`        | Config surfaces exist (`config.get`, `config.set`, `config.apply`), but the exact source-label field beyond the known config path is not frozen. |
| `contract_gap_items`        | `NEW FIELD NEEDED` | The rail needs explicit contract-gap objects, not a currently proven raw field family.                                                           |
| `receipt_coverage_summary`  | `NEW FIELD NEEDED` | Coverage/provenance rollups are not part of the tracked Control UI contract today.                                                               |
| `latest_gate_result`        | `NEW FIELD NEEDED` | The charrette asks for gate-state visibility that is not proven in current surfaces.                                                             |
| `branch_ref`                | `NEW FIELD NEEDED` | Repo branch context is not proven as a Control UI telemetry field.                                                                               |
| `pr_ref`                    | `NEW FIELD NEEDED` | Same boundary as `branch_ref`; useful, but not proven in the current contract.                                                                   |
| `session_evidence_coverage` | `NEW FIELD NEEDED` | Requires a new rollup over session artifacts and proof sources.                                                                                  |
| `lineage_notes`             | `NEW FIELD NEEDED` | The rail needs lineage interpretation, not just raw data.                                                                                        |
| `telemetry_trust_notes`     | `NEW FIELD NEEDED` | Explicit trust explanation is a new governance surface requirement.                                                                              |

### 6. Inspector Drawer (per detail)

| Field                   | Status             | Note                                                                                               |
| ----------------------- | ------------------ | -------------------------------------------------------------------------------------------------- |
| `run_id`                | `EXISTING`         | Exact identifier is proven in the documented `chat.send` ack flow.                                 |
| `session_key`           | `EXISTING`         | Exact identifier is proven in the documented `chat.abort` flow.                                    |
| `job_id`                | `TO VERIFY`        | A job concept may exist in cron/run surfaces, but the exact drawer field is not proven.            |
| `selected_node_id`      | `TO VERIFY`        | Needed to bind the drawer to a node, but exact node identifiers remain unproven.                   |
| `workspace_ref`         | `NEW FIELD NEEDED` | Workspace visibility is requested by the charrette and not proven in current Control UI contracts. |
| `last_tool_call_name`   | `TO VERIFY`        | Tool-call streaming exists in chat, but the exact drawer field names are not frozen.               |
| `last_tool_call_status` | `TO VERIFY`        | Same evidence boundary as `last_tool_call_name`.                                                   |
| `artifact_links`        | `TO VERIFY`        | Artifact references likely exist somewhere in events/history, but exact link fields are unproven.  |
| `receipt_links`         | `NEW FIELD NEEDED` | Receipt-level linkage is a new provenance requirement.                                             |
| `branch_ref`            | `NEW FIELD NEEDED` | Branch context is not proven as an inspector field today.                                          |
| `pr_ref`                | `NEW FIELD NEEDED` | PR context is not proven as an inspector field today.                                              |
| `logs_trace_ref`        | `TO VERIFY`        | `logs.tail` proves log access, but not a specific drawer reference contract.                       |
| `governance_flags`      | `NEW FIELD NEEDED` | The drawer needs explicit governance annotations that are not proven in current surfaces.          |
| `metric_trust_sources`  | `NEW FIELD NEEDED` | Exact provenance per metric is a new trust-model requirement.                                      |

### Synthesis notes

- Generic Control UI evidence is real but narrow: it proves capability families, not a Workforce Alpha-specific page contract.
- Exact existing fields are limited to bootstrap identity/config values plus the documented identifiers `runId` and `sessionKey`.
- The largest new-contract zones are:
  - command hierarchy semantics (`role_label`, `reports_to_node_id`, canopy connectors)
  - operator-state taxonomy rollups (`Idle-ready`, `Blocked`, `Stale`, `Missing telemetry`, `Failed gates`)
  - trust/provenance synthesis (`trust_badge`, `telemetry_trust_notes`, `metric_trust_sources`)
  - evidence/governance rollups (`contract_gap_items`, `receipt_coverage_summary`, `session_evidence_coverage`)
- This means section G must treat implementation as a contract-first exercise, not a styling-only refactor.

## G) COMPONENT / IMPLEMENTATION PLAN

### Section framing

- VERIFIED CURRENT STATE: The tracked repo already has a generic Control UI shell in `ui/src/ui/app.ts` and `ui/src/ui/app-view-state.ts`, and the relevant current mount point is the existing `overview` tab rendered through `ui/src/ui/app-render.ts` and hydrated by `loadOverview(...)` in `ui/src/ui/app-settings.ts`. That overview surface currently uses `ui/src/ui/views/overview.ts`, summary cards in `ui/src/ui/views/overview-cards.ts`, an event log in `ui/src/ui/views/overview-event-log.ts`, plus separate node/device and sessions/admin surfaces in `ui/src/ui/views/nodes.ts` and `ui/src/ui/views/sessions.ts`.
- TARGET ARCHITECTURE: Workforce Alpha V2 should first land inside that existing `overview` mount point, replacing its capability-first composition with a command-cockpit composition that reuses the generic loaders where they are truthful, adds a dedicated derived-state layer for command hierarchy and trust interpretation, and keeps section F contract gaps explicit.
- TO VERIFY / UNCONFIRMED: The repo still does not prove a Workforce Alpha-specific page contract or a repo-local V1 page surface. Any implementation work that depends on command hierarchy semantics, trust badges, ops-strip rollups, receipt coverage, branch/PR refs, or governance flags must stay behind explicit contract verification or new backend work.

### Likely component breakdown

- New feature surface:
  - `Workforce Alpha V2 page shell` mounted inside the existing `overview` route rather than a same-weight overview card wall.
- New V2 components:
  - `CommandCanopy`
  - `CommandLeaderCard`
  - `LiveOpsStrip`
  - `OpsMetricTile`
  - `CommandTree`
  - `CommandNodeCard`
  - `ExecutionFeed`
  - `ExecutionFeedItem`
  - `EvidenceGovernanceRail`
  - `EvidenceRailItem`
  - `InspectorDrawer`
  - `TrustBadge`
  - `ContractGapList`
  - `TelemetryEmptyState`
- New adapter / selector layer:
  - `WorkforceAlphaSelectors` or equivalent feature-local mappers that turn generic Control UI payloads into canopy, tree, feed, evidence, and drawer view models without mutating the raw controller results.
- Existing reusable seams:
  - `ui/src/ui/controllers/control-ui-bootstrap.ts`
  - `ui/src/ui/controllers/presence.ts`
  - `ui/src/ui/controllers/nodes.ts`
  - `ui/src/ui/controllers/sessions.ts`
  - `ui/src/ui/controllers/usage.ts`
  - `ui/src/ui/controllers/logs.ts`
  - `ui/src/ui/controllers/exec-approvals.ts`
  - `ui/src/ui/controllers/health.ts`

### State model

- Client-side source state should remain in the existing app shell:
  - bootstrap identity from `ui/src/ui/controllers/control-ui-bootstrap.ts`
  - node inventory from `ui/src/ui/controllers/nodes.ts`
  - presence from `ui/src/ui/controllers/presence.ts`
  - session/run data from `ui/src/ui/controllers/sessions.ts`
  - usage rollups from `ui/src/ui/controllers/usage.ts`
  - health from `ui/src/ui/controllers/health.ts`
  - evidence/log surfaces from `ui/src/ui/controllers/logs.ts` and `ui/src/ui/controllers/exec-approvals.ts`
  - event stream from the existing app event log in `ui/src/ui/app.ts`
- Add a dedicated `workforceAlpha` derived-state slice inside the UI layer:
  - `canopyModel`
  - `opsStripModel`
  - `commandTreeModel`
  - `executionFeedModel`
  - `evidenceRailModel`
  - `inspectorSelection`
  - `trustDiagnostics`
- Derived-state rules:
  - only compute from proven raw inputs
  - preserve raw/source-level uncertainty in the derived model
  - never coerce `TO VERIFY` or `NEW FIELD NEEDED` into fake live values
- Server-side model:
  - phase 1 should stay on existing generic gateway RPCs and client-side adaptation
  - phase 2 may introduce new gateway aggregation only for the section F fields that are clearly `NEW FIELD NEEDED`

### API / data dependency map

| V2 surface                        | Current proven source                                                    | Repo seam                                                                                                     | Status                         | Implementation note                                                                                                                                                      |
| --------------------------------- | ------------------------------------------------------------------------ | ------------------------------------------------------------------------------------------------------------- | ------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| Command Canopy bootstrap identity | `assistantName`, `assistantAvatar`, `assistantAgentId`, `serverVersion?` | `ui/src/ui/controllers/control-ui-bootstrap.ts`                                                               | `PARTIAL`                      | Good enough for root shell identity only; `Voltaris V2`, `President-A`, mission label, and command relationship stay `TO VERIFY` or `NEW FIELD NEEDED`.                  |
| Command Tree skeleton             | generic node inventory                                                   | `ui/src/ui/controllers/nodes.ts` + `node.list`                                                                | `PARTIAL`                      | Can support an initial read-only node surface, but command roles and reporting lines are not proven.                                                                     |
| Liveness / presence hints         | generic instance presence                                                | `ui/src/ui/controllers/presence.ts` + `system-presence`                                                       | `PARTIAL`                      | Useful for heartbeat/presence hints, not sufficient alone for the V2 operator-state taxonomy.                                                                            |
| Session/run hints                 | generic sessions list and patch surface                                  | `ui/src/ui/controllers/sessions.ts` + `sessions.list` / `sessions.patch`                                      | `PARTIAL`                      | Can support current-job, updated-at, and run/session identity hints, but not the full command model.                                                                     |
| Usage / cost detail               | session usage + cost rollups                                             | `ui/src/ui/controllers/usage.ts` + `sessions.usage` / `usage.cost`                                            | `PARTIAL`                      | Reusable for cost/token inspection, likely secondary or drawer-only in V2.                                                                                               |
| Execution Feed seed               | existing app event log plus chat/session identifiers                     | `ui/src/ui/app.ts` + `ui/src/ui/views/overview-event-log.ts`                                                  | `PARTIAL`                      | Can seed a feed surface, but normalized event taxonomy, artifact refs, and escalation states still need contract work.                                                   |
| Evidence rail base                | config path, server version, logs, exec approvals, health                | `ui/src/ui/controllers/logs.ts`, `ui/src/ui/controllers/exec-approvals.ts`, `ui/src/ui/controllers/health.ts` | `PARTIAL`                      | Enough to start a truthful rail, but receipt coverage, gate results, lineage notes, and trust explanations are still new work.                                           |
| Inspector identifiers             | `runId`, `sessionKey`, maybe `job_id`                                    | section F plus `ui/src/ui/controllers/sessions.ts`                                                            | `PARTIAL`                      | Drawer can launch with read-only identity fields first; workspace, receipt links, trace refs, and governance flags remain unproven.                                      |
| Live Ops Strip rollups            | none as a frozen Workforce contract                                      | `n/a`                                                                                                         | `TO VERIFY / NEW FIELD NEEDED` | `Idle-ready`, `Blocked`, `Stale`, `Missing telemetry`, `Queue depth`, `Last receipt`, and `Failed gates` should not ship as live metrics until explicit contracts exist. |
| Command hierarchy semantics       | none as a frozen Workforce contract                                      | `n/a`                                                                                                         | `NEW FIELD NEEDED`             | `President-A`, `reports_to`, explicit authority connectors, and role taxonomy require a new command model.                                                               |
| Trust-state synthesis             | none as a frozen Workforce contract                                      | `n/a`                                                                                                         | `NEW FIELD NEEDED`             | `Observed`, `Projected`, `Manifest-only`, and `Missing` require a first-class trust/provenance layer.                                                                    |

### Existing component refactor / replacement plan

- `ui/src/ui/views/overview.ts`
  - refactor from a generic gateway summary surface into a thin shell that composes cockpit sections
  - keep the existing route entry, but replace the current access/cards-first story with the command-first story
- `ui/src/ui/views/overview-cards.ts`
  - replace for Workforce Alpha
  - the same-weight stat-card pattern conflicts with command-first hierarchy
- `ui/src/ui/views/overview-event-log.ts`
  - refactor as a utility pattern for the future `ExecutionFeed`
  - reuse timestamp/payload formatting ideas, but replace the UI shell and semantics
- `ui/src/ui/views/nodes.ts`
  - keep for device/node administration
  - do not mutate this admin surface into the main command tree
  - reuse only the generic node loading seam, not the current layout
- `ui/src/ui/views/sessions.ts`
  - keep as a detail/admin surface
  - reuse sorting/filtering and drill-down patterns where useful, especially inside the drawer
- `ui/src/ui/app.ts` and `ui/src/ui/app-view-state.ts`
  - refactor to isolate a feature-local `workforceAlpha` state slice instead of growing more generic top-level state fields without structure

### Safe implementation sequence

1. Add the Workforce Alpha V2 cockpit composition inside the existing `overview` route and `loadOverview(...)` refresh path.
   - No new telemetry promises yet.
   - Render explicit `TO VERIFY / UNCONFIRMED` placeholders where section F says the contract is not ready.
2. Implement the `Command Canopy` and `Chain of Command Tree` with only proven or honestly partial inputs.
   - Reuse bootstrap identity, node inventory, presence, and session hints.
   - Do not fabricate `President-A`, role edges, or trust badges.
3. Implement the `Execution Feed` and a minimal `Inspector Drawer`.
   - Start with repo-proven identifiers such as `runId` and `sessionKey`.
   - Keep artifact refs, escalation states, and workspace detail as explicit gaps where needed.
4. Implement the `Evidence + Governance Rail`.
   - Start from config path, server version, logs, approvals, and health.
   - Treat receipt coverage, gate results, lineage notes, and trust notes as contract-driven follow-ons.
5. Add only the ops-strip metrics that can be proven from frozen contracts.
   - Anything in section F labeled `NEW FIELD NEEDED` stays out of live rendering or is shown as unavailable with a next-step explanation.
6. Only after contract approval, add new gateway aggregation or new payload fields for:
   - command relationships
   - operator-state rollups
   - trust badges
   - evidence coverage / gate results / governance flags
7. Apply responsive tuning and visual polish last, after the data/trust model is stable.

### Branch / PR plan

- No direct-to-main implementation.
- The repo is currently on `m20-trust-the-refusal-closeout`, so the eventual implementation base branch is `TO VERIFY / UNCONFIRMED` and should be an approved product integration baseline, not this governance lane by default.
- Prefer a stacked or tightly scoped PR sequence:
  - PR 1: feature shell, route wiring, and feature-local state scaffolding
  - PR 2: canopy + command tree with truthful empty states
  - PR 3: execution feed + minimal inspector drawer
  - PR 4: evidence/governance rail + trust-label rendering
  - PR 5: contract-expansion work for new rollups and hierarchy semantics
  - PR 6: responsive polish, UI cleanup, and acceptance hardening
- If new gateway data contracts are required, land the contract/backend PR before or alongside the dependent UI PR; do not hide contract additions inside styling PRs.

### Test plan

- Unit tests
  - selector/adaptor tests for canopy, tree, feed, and evidence derivation
  - trust-state resolution tests
  - empty-state / unavailable-state decision tests
- Controller tests
  - follow existing patterns in `ui/src/ui/controllers/control-ui-bootstrap.test.ts`, `ui/src/ui/controllers/sessions.test.ts`, and related controller tests
  - verify fallback behavior when sources are partial, stale, or absent
- View tests
  - follow existing patterns such as `ui/src/ui/views/overview.node.test.ts` and `ui/src/ui/views/sessions.test.ts`
  - add rendering tests for canopy, command tree, execution feed, evidence rail, and drawer
- Integration tests
  - app-level navigation and feature-state tests in the `ui/src/ui/app*.test.ts` style
  - verify drawer open/close, node selection, and filter behavior
  - verify that `TO VERIFY / UNCONFIRMED` fields stay visibly honest
  - preserve partial-load behavior from the current `Promise.allSettled` overview refresh path instead of making the cockpit all-or-nothing
- Manual operator validation
  - desktop-first five-second operator test
  - mobile degradation / responsive checks
  - trust-state readability under sparse and missing data
- Contract validation
  - no acceptance claim that live ops-strip rollups, trust badges, or hierarchy semantics are complete until the `NEW FIELD NEEDED` items from section F are explicitly implemented and tested

## H) ACCEPTANCE CRITERIA

### Section framing

- VERIFIED CURRENT STATE: Sections A through G are frozen. The tracked pack does not preserve a separately labeled `REQUIRED ACCEPTANCE CRITERIA` block from the original brief, so the criteria below are compiled directly from the already-frozen strategic direction in sections A through G rather than transcribed from a standalone source file.
- TARGET ARCHITECTURE: Workforce Alpha V2 is successful only if the final page behaves like a truthful `Command Cockpit`: command-first, operator-readable in seconds, evidence-visible, and explicit about telemetry trust.
- TO VERIFY / UNCONFIRMED: Any criterion that depends on section F items marked `TO VERIFY` or `NEW FIELD NEEDED` is conditional on those contracts being implemented. Until then, the page must succeed by rendering honest unavailable states rather than invented telemetry.

### Required acceptance criteria

1. `Voltaris V2` is visibly the top command node on first read, `President-A` is directly beneath, and `Strike Team Alpha` agents sit beneath `President-A` with authority connectors that make the chain of command unmistakable.
2. The page is not a giant org-chart poster and not a same-weight card wall; it reads first as a control surface, then as a telemetry surface, then as a governance/evidence surface.
3. The six mandatory V2 surfaces are present in the page model:
   `Command Canopy`, `Live Ops Strip`, `Chain of Command Tree`, `Execution Feed`, `Evidence + Governance Rail`, and `Inspector Drawer`.
4. `Command Canopy` visibly carries the command story first and shows the required canopy slots:
   status, current mission, last orchestration event, active run count, approvals pending, and stale/downstream issue count.
   If any canopy field is not proven, it is rendered as `TO VERIFY / UNCONFIRMED` rather than omitted or fabricated.
5. `Live Ops Strip` uses the explicit V2 operator taxonomy and does not use `Not working`.
   Required states: `Active`, `Idle-ready`, `Awaiting approval`, `Blocked`, `Degraded`, `Stale`, `Missing telemetry`, and `Offline` only when truly known.
   Required strip metrics: `Active`, `Idle-ready`, `Awaiting approval`, `Blocked`, `Stale`, `Missing telemetry`, `Queue depth`, `Last receipt`, and `Failed gates`.
6. `Chain of Command Tree` behaves as the main content anchor and each node surfaces the required operational summary:
   agent name, `agent_id`, role, `reports_to`, current state, current job or `no active run`, `started_at / age`, last heartbeat, last artifact, model/provider, token/context usage, and trust badge.
   Any missing or unproven node field remains explicitly marked rather than implied.
7. `Execution Feed` answers the operator questions `what changed`, `which node acted`, `what artifact or event was produced`, and `whether it succeeded, stalled, or escalated`.
   It must be chronological, filterable by node, and higher-signal than raw log spam.
8. `Evidence + Governance Rail` remains visible but secondary to the command story and shows:
   contract gaps, manifest/config source, receipt coverage, latest gate result, branch/PR refs if available, session evidence coverage, and lineage / telemetry trust notes.
   Missing governance fields must be shown as unavailable, not silently dropped.
9. `Inspector Drawer` opens from nodes, execution events, and evidence items, and exposes:
   `run_id`, `job_id`, `session key`, workspace, last tool call, artifact links, receipt links, branch/PR, logs/traces, related governance flags, and exact trust source for each metric.
   Unknown fields remain present with explicit trust labeling.
10. The page passes the five-second operator test:
    the operator can answer who is in charge, who is doing work, what is blocked, what proof exists, and whether intervention is needed without drilling into secondary views first.
11. Every key metric or node shows an explicit trust / telemetry badge using the V2 taxonomy:
    `Observed`, `Projected`, `Manifest-only`, or `Missing`.
    The UI must not imply that a value is observed when it is only projected or absent.
12. Every empty or unavailable state explains what is missing, why it is missing if known, and what operator action or system condition is required for data to appear.
    The page must not render vague dead cards.
13. The roster, command topology, telemetry, and governance surfaces feel like one coherent system rather than separate panels placed next to each other.
14. The visual system preserves the dark neon Sprytly / CyborgClaw identity, but readability, hierarchy, and operational clarity outrank ornament.
15. The desktop-first hierarchy survives responsive degradation:
    canopy first, ops strip second, command tree third, feed next, evidence rail collapsible before hierarchy, inspector drawer available as an overlay on smaller screens.
16. No section may present any section F `TO VERIFY` or `NEW FIELD NEEDED` field as live truth before the required contract work lands.
17. The implementation passes only when the acceptance bar is met without reopening the design direction:
    `Command Cockpit` remains the selected direction, and any later implementation detail must stay inside the frozen wireframe, telemetry map, and implementation plan boundaries.

## I) TO VERIFY / UNCONFIRMED ITEMS

Evidence basis for this section: the tracked repo proves a generic Control UI and its loaders in `src/gateway/control-ui-contract.ts`, `ui/src/ui/app-settings.ts`, `ui/src/ui/views/overview.ts`, the generic UI controllers, `src/shared/node-list-types.ts`, `src/infra/system-presence.ts`, and `src/commands/health.ts`. It does not prove a repo-local Workforce Alpha page contract.

### Section framing

- VERIFIED CURRENT STATE: Sections A through H are frozen. The charrette now has a stable selected direction, wireframe, telemetry map, implementation plan, and acceptance bar. What remains unresolved is not page structure but the backend, API, and contract truth required to implement that structure honestly.
- TARGET ARCHITECTURE: This section is the bounded unresolved-items ledger for Workforce Alpha V2. It names the proof gaps that must be resolved before implementation can claim full telemetry fidelity, hierarchy truth, or acceptance completeness.
- TO VERIFY / UNCONFIRMED: The repo still does not prove a repo-local Workforce Alpha V1 page, route, or Workforce-specific telemetry schema. Most Workforce-specific hierarchy, trust, evidence, and rollup fields remain either `TO VERIFY` or `NEW FIELD NEEDED`.

### 1. Repo-local surface provenance

- Verify whether a tracked repo-local Workforce Alpha V1 page, route, component tree, or data contract exists at all.
  Rationale: Section A established that the claimed current V1 surface is not clearly present in tracked repo artifacts, so implementation cannot assume a direct in-repo replacement path.
- Verify whether the external Mission 2 baseline is only contextual carry-through or the actual current source of truth for Workforce Alpha behavior.
  Rationale: This prevents external baseline assumptions from silently becoming repo-local implementation truth.

### 2. Command identity and hierarchy contracts

- Verify the authoritative identifiers and display names for `Voltaris V2`, `President-A`, and the Strike Team Alpha agents.
  Rationale: The canopy and command tree cannot render the top-of-page leadership story honestly without a proven identity model.
- Verify the canonical `reports_to` contract and the required command ordering beneath `President-A`.
  Rationale: Connector lines, grouping, and node ordering in the chain-of-command tree depend on a real hierarchy contract, not design intent alone.
- Verify whether canopy fields such as `current_mission_label`, `last_orchestration_event_label`, `active_run_count`, and `approvals_pending_count` already exist as raw fields or must be derived.
  Rationale: These are mandatory page-model slots and cannot be represented as live telemetry until their provenance is known.

### 3. Operator-state taxonomy and rollup contracts

- Verify the source and derivation rules for `Active`, `Idle-ready`, `Awaiting approval`, `Blocked`, `Degraded`, `Stale`, `Missing telemetry`, and `Offline`.
  Rationale: Section H requires this exact status taxonomy and explicitly forbids the old `Not working` shorthand.
- Verify whether `stale_or_downstream_issue_count`, `queue_depth`, `last_receipt_at`, and `failed_gates_count` exist already or require new aggregation fields.
  Rationale: These are mandatory canopy or ops-strip metrics, and most are still marked `NEW FIELD NEEDED` in section F.
- Verify the thresholds and semantics behind stale, missing-telemetry, degraded, and failed-gate states.
  Rationale: The UI cannot classify nodes or rollups truthfully without stable definitions.

### 4. Per-node telemetry contracts

- Verify the exact per-node fields for `display_name`, `agent_id`, `role`, `current_job_label`, `started_at`, `last_heartbeat_at`, `last_artifact_ref`, `model_name`, `provider_name`, `token_usage`, and `context_usage`.
  Rationale: Command-tree nodes and inspector summaries depend on these fields being real, typed, and source-backed.
- Verify whether the required trust badge can be derived from existing raw data or whether a dedicated trust-source contract is needed.
  Rationale: The selected direction and acceptance bar both require explicit trust badges for key node metrics.

### 5. Execution feed contracts

- Verify the normalized execution-event schema for `event_id`, `event_at`, `actor_node_id`, `actor_display_name`, `event_type`, `event_summary`, and `artifact_or_event_ref`.
  Rationale: The current generic Control UI event surfaces are not yet proven to satisfy the Workforce-specific execution-feed model.
- Verify the outcome taxonomy and supporting fields for `succeeded`, `stalled`, `escalated`, and any escalation target or reason.
  Rationale: Section H requires the feed to explain recent changes and whether action succeeded, stalled, or escalated.

### 6. Evidence, governance, and provenance contracts

- Verify the semantics behind `manifest_config_source` beyond the currently known config path.
  Rationale: The evidence rail needs a truthful source label, not just a path-shaped string.
- Verify whether `contract_gap_items`, `receipt_coverage_summary`, `latest_gate_result`, `session_evidence_coverage`, `lineage_notes`, and `telemetry_trust_notes` can be sourced from existing data or require new contracts.
  Rationale: These are required evidence-rail surfaces and most remain `NEW FIELD NEEDED`.
- Verify whether `branch_ref` and `pr_ref` belong in the page contract at all, and under what conditions they are legitimately available.
  Rationale: The page model allows them only if available; implementation must not normalize optional repo evidence into mandatory live truth.

### 7. Inspector drawer contracts

- Verify the availability and provenance of `job_id`, `workspace_ref`, `artifact_links`, `receipt_links`, `logs_trace_ref`, `governance_flags`, and `metric_trust_sources`.
  Rationale: The drawer cannot satisfy the frozen acceptance bar without a truthful evidence trail for each drill-down field.
- Verify which drawer fields can be fulfilled by existing generic sessions, logs, approvals, or node data, and which require new gateway or provenance contracts.
  Rationale: This separates adapter work from genuine backend or contract-expansion work.

### 8. Implementation seam verification

- Verify exactly which section F `TO VERIFY` fields can be satisfied by current generic controllers and derived-state adapters without backend changes.
  Rationale: Section G's safe implementation sequence depends on this boundary staying explicit.
- Verify whether the existing `overview` route should remain the long-term Workforce Alpha cockpit mount point or only serve as the first implementation seam.
  Rationale: This affects how much shell restructuring is safe in the first UI PR.
- Verify whether health data should be pulled into the cockpit refresh path and, if so, whether the current overview aggregator is the right place to join it.
  Rationale: The generic health controller exists, but the current overview load path does not yet prove that it belongs in the Workforce cockpit model.

### 9. Acceptance dependency verification

- Verify which section H acceptance criteria can be met in a frontend-only first PR and which must remain gated on future contract work.
  Rationale: Ratification should not overpromise immediate delivery of hierarchy, trust, or evidence features that still depend on unresolved contracts.
- Verify the naming and scope mismatches already visible between the frozen docs, including canopy `status` versus section F field mapping, `Degraded` and `Offline` semantics versus strip-count expectations, and `agent_id` versus `node_id` terminology.
  Rationale: Implementation cannot satisfy the acceptance bar truthfully until these frozen-document ambiguities are reconciled into one stable contract vocabulary.

### Planning progress after the data-contracts and APIs lane

- This unresolved-items ledger is now paired with `DATA_CONTRACTS_AND_APIS_PLAN.md`, which turns the section I gaps into one contract-planning packet instead of leaving them as a design-only backlog.
- `Repo-local surface provenance` is `PARTIALLY RESOLVED`:
  the tracked repo proves the generic `overview` mount and the generic Control UI gateway transport, but still does not prove a repo-local Workforce Alpha V1 page contract.
- `Command identity and hierarchy contracts` are `PARTIALLY RESOLVED`:
  bootstrap identity, `agents.list`, `agent.identity.get`, and session lineage fields can seed labels and relationship hints, but canonical `reports_to`, role taxonomy, `Voltaris V2` / `President-A` hierarchy, and Strike Team Alpha membership remain `NEW CONTRACT NEEDED`.
- `Operator-state taxonomy and rollup contracts` remain `NEW CONTRACT NEEDED`:
  presence, sessions, channels, health, and cron data can support projection, but the ratified state taxonomy and canopy / strip rollups still require explicit projector rules and normalized output fields.
- `Per-node telemetry contracts` are `PARTIALLY RESOLVED`:
  connectivity, identity, some model/provider hints, and limited usage fields can be projected from existing generic sources, while start time, age, artifact refs, trust envelopes, and authoritative role / job semantics still require new contract work.
- `Execution feed contracts` remain `NEW CONTRACT NEEDED`:
  cron runs, queued system events, node exec events, raw websocket events, and logs are real sources, but they do not yet provide one stable Workforce actor / outcome / artifact schema.
- `Evidence, governance, and provenance contracts` are `PARTIALLY RESOLVED`:
  config, approvals, ACP provenance, and related governance inputs give real anchors, but contract-gap rollups, receipt coverage, lineage notes, trust notes, and optional branch / PR refs remain `NEW CONTRACT NEEDED`.
- `Inspector drawer contracts` are `PARTIALLY RESOLVED`:
  session preview, usage rows, node detail, logs, workspace inspection, and approval context provide real drill-down seeds, but a cockpit-grade drawer contract with artifact links, receipt links, governance flags, and metric-trust detail is not emitted today.
- `Implementation seam verification` is `RESOLVED` for the next bounded lane:
  the first implementation seam should stay on the existing `overview` route and the current Gateway RPC transport, while the new Workforce DTOs are planned as aggregated gateway methods rather than an immediate REST expansion.
- `Acceptance dependency verification` is `PARTIALLY RESOLVED`:
  the frozen acceptance bar stays valid, but several criteria remain gated on future hierarchy, trust, evidence, and execution-feed contracts and must not be presented as frontend-only deliverables.

## First PR Cut Recommendation

- Recommended first PR: keep the existing `overview` route as the initial mount point, replace the current cards-first composition with a command-first shell, and use only already-proven generic data sources plus explicit placeholders for missing Workforce-specific fields.
- Safe proven inputs for PR 1: `assistantName`, `assistantAvatar`, `assistantAgentId`, `serverVersion?`, documented config-path context, generic node/session/presence surfaces, and existing event/log evidence inputs already used by the Control UI shell.
- Hard boundaries for PR 1: no new RPCs, no invented command hierarchy semantics, no fake rollups, no fake trust badges, and no claim that section F `TO VERIFY` or `NEW FIELD NEEDED` fields are live.
- UI behavior for unresolved fields: render clear unavailable states that explain what is missing and what contract or backend work is required before live values can appear.
- Recommended PR 1 scope: shell layout, adapter seams, honest placeholders, command-first hierarchy framing, and regression-safe tests for rendering, empty states, and partial-load behavior.
- Recommended follow-on sequencing after PR 1: add contract-backed hierarchy and rollup fields first, then evidence and inspector enrichment, and only then tighten the final acceptance bar against live data.
- The new contract-planning reference for those later phases is `DATA_CONTRACTS_AND_APIS_PLAN.md`, which freezes the RPC-first aggregation path and the remaining `NEW CONTRACT NEEDED` areas.

## Implementation progress after the frontend UI-components lane

- The first Workforce Alpha V2 `Command Cockpit` UI slice is now implemented in the sibling `sprytly-internal-dashboard` frontend against the landed snapshot, execution, and inspector routes.
- Implemented surfaces: `Command Canopy`, `Live Ops Strip`, `Chain of Command Tree`, `Execution Feed`, `Evidence + Governance Rail`, and `Inspector Drawer`.
- UI truth posture: `trustState`, `sourceKinds`, `updatedAt`, and `missingFields` are rendered explicitly, and the page uses partial-load behavior so missing or failed surfaces do not get silently collapsed into fake green status.
- Validation proof: sibling web build passed, sibling lint passed with warnings only, and a headless authenticated browser pass confirmed the hierarchy story, live sections, and inspector-drawer interaction against the landed backend routes.
- Next bounded action: review the landed cockpit UI against section H acceptance criteria, validate operator behavior end to end, and identify any deployment-readiness blockers without widening scope.

## Stability note after the backend JSON-output regression fix

- The user-provided screenshot exposed a live regression on `127.0.0.1:18792`: the page was fetching Workforce Alpha snapshot and execution on an authenticated session but receiving `<!doctype html>` instead of JSON.
- Verified root cause: the live `18792` backend process was stale and did not have the new Workforce Alpha routes loaded after auth, so authenticated `/api/mission-control/workforce/alpha/*` misses fell through to the SPA shell. The backend also lacked an explicit JSON terminator for unmatched authenticated `/api` paths.
- Fix applied: the sibling sprytly backend now includes an `/api` JSON 404 guard and the live `18792` instance was restarted onto the current code path.
- Post-fix truth: authenticated snapshot, execution, and inspector requests on `127.0.0.1:18792` now return `application/json`, and the cockpit page renders again instead of surfacing the previous HTML parse failure.

## Validation progress after the UI review lane

- The live Workforce Alpha V2 cockpit on `127.0.0.1:18792` now has a frozen validation packet in `UI_VALIDATION_REPORT.md`.
- Acceptance result: `15 pass`, `1 conditional`, `1 fail`.
- The strongest blocker is responsive behavior, not core hierarchy or contract honesty:
  a live `720px` probe still shows the main cockpit body holding a three-column desktop grid instead of collapsing the evidence rail before the hierarchy.
- Secondary validation concerns remain:
  the execution feed still reads as a projected cross-domain activity stream more than a high-signal Workforce feed, and trust-language vocabulary is still mixed across `Projected`, `Observed`, `Admitted`, `Gap`, `Live`, and `TO VERIFY / UNCONFIRMED`.
- The page is therefore reviewable and structurally aligned to `Command Cockpit`, but it is not yet recommended for broad deployment ratification.
- Next bounded action: review `UI_VALIDATION_REPORT.md` and decide whether to ratify deployment or send the mission through one bounded follow-up fix lane.

## Validation supersession after the UI hardening lane

- The previous `15 pass`, `1 conditional`, `1 fail` review packet is now superseded by the hardened validation result frozen in `UI_VALIDATION_REPORT.md`.
- Current acceptance result: `16 pass`, `1 conditional`, `0 fail`.
- Responsive collapse is now proven on the live `720px` origin, and trust-language vocabulary is normalized across the visible cockpit surfaces.
- The remaining caveat is the execution feed only:
  it is now framed honestly as projected activity when actor/outcome mapping is absent, but the live payload still does not admit richer Workforce-specific signal for most rows.
- The page is now ready for deployment ratification review rather than remaining on broad deployment hold.
- Current bounded next action: review `UI_VALIDATION_REPORT.md` and authorize or reject the final deployment process to `main`.
