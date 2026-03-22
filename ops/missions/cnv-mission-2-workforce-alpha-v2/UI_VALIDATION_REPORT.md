# UI_VALIDATION_REPORT

## Purpose

Freeze the live review and acceptance-validation result for the landed Workforce Alpha V2 `Command Cockpit` UI slice.

## Validation scope

- Live origin: `http://127.0.0.1:18792/mission-control/workforce/alpha`
- Validation time: `2026-03-22T19:26:32Z`
- Reference artifacts:
  - `V2_WIREFRAME.md`
  - `CHARRETTE_OUTPUT.md` section `H) ACCEPTANCE CRITERIA`
  - `DATA_CONTRACTS_AND_APIS_PLAN.md`
- Evidence methods:
  - authenticated live API reads for snapshot, execution, and inspector
  - authenticated headless Chrome review on the live origin
  - direct responsive probe at `720px` width
  - saved browser artifacts in `evidence/ui-hardening-2026-03-22/desktop.png`, `evidence/ui-hardening-2026-03-22/responsive-720.png`, `evidence/ui-hardening-2026-03-22/validation.json`, and `evidence/ui-hardening-2026-03-22/layout-positions.json`

## Executive verdict

- Current readiness: `READY FOR DEPLOYMENT RATIFICATION`
- Acceptance summary: `16 pass`, `1 conditional`, `0 fail`
- Safe posture today: `ratification-ready internal build; deployment approval should explicitly acknowledge the remaining execution-feed signal caveat`

The implemented cockpit is now strong enough to reopen deployment ratification. The page is command-first, responsive collapse is demonstrated, trust taxonomy is normalized across the main cockpit surfaces, and the UI remains honest about uncertainty rather than inventing runtime truth. The only meaningful caveat left is the execution feed: it is now framed correctly as projected cross-domain activity when node/outcome mapping is absent, but the current live payload still does not give operators a rich Workforce-specific execution story.

## Section framing

- VERIFIED CURRENT STATE: the live Workforce Alpha page on `127.0.0.1:18792` renders the `Command Cockpit` surfaces against valid JSON contracts, passes the responsive hierarchy check at `720px`, and no longer reproduces the earlier `<!doctype` parse failure or the mixed trust-language drift seen in the previous validation packet.
- TARGET ARCHITECTURE: the page should now be treated as ready for deployment ratification, with the remaining decision centered on whether the currently honest-but-projected execution feed is acceptable for deployment.
- TO VERIFY / UNCONFIRMED: several drill-down and evidence fields remain intentionally projected or missing, and the execution feed still lacks broad actor/outcome normalization from the backend payload.

## Verified current state

- The page renders all six required surfaces: `Command Canopy`, `Live Ops Strip`, `Chain of Command Tree`, `Execution Feed`, `Evidence + Governance Rail`, and an interactive inspector drawer.
- The hierarchy story is visible on first read: `Voltaris V2` appears as the lead node, `Strike Team A President` appears directly beneath, and five current Strike Team Alpha seat cards appear beneath that tier.
- The UI keeps `trustState`, `sourceKinds`, `updatedAt`, and `missingFields` visible rather than fabricating complete runtime truth.
- The `720px` responsive proof now shows the main body stacked in the correct order, with `Chain of Command Tree`, `Execution Feed`, and `Evidence + Governance Rail` each rendering at full-width (`684px`) rather than preserving the old three-column desktop grid.
- The snapshot contract currently resolves `Voltaris V2` and `Strike Team A President`, with live ops showing `active=0`, `idleReady=2`, `stale=3`, and several canopy / strip metrics still null and rendered as gaps.
- `Voltaris V2` now renders as a unified command tile with model control, token telemetry, and tool / skill drill-through inside the canopy rather than a split control panel.
- `Strike Team A President` now renders with a matching structured tile and a persisted team-builder panel. The live snapshot currently reads back `assembleMode=president_auto`, `selectionMode=auto`, `seatCount=5`, and `locked=true`.
- The inspector drill-down works and shows real session-backed detail for `Strike Team A President`, including `sessionKey`, model/provider, token/context usage, and explicit missing-field handling for `runId`, `jobId`, artifact links, receipt links, branch/PR refs, and governance flags.
- Trust vocabulary is now normalized through the visible cockpit surfaces to `Observed`, `Projected`, `Manifest-only`, and `Missing`; the earlier `Live`, `Admitted`, `Gap`, and `Projected gap` labels are no longer driving the main status story.

## Findings ordered by severity

### 1. The execution feed is still lower-signal than the ratified wireframe ideally wants

- Evidence: the live execution feed currently returns `20` items, with the leading kinds still including `hivemind.session.compacted`, `idea.salon_run`, `idea.deleted`, and `development.stream_session.stop`; all `20` items are still missing a mapped `actorNodeId` or `actorDisplayName`, and `9` items still carry no normalized `outcome`.
- Why it matters: the wireframe and acceptance bar prefer a feed that answers `what changed`, `which node acted`, and `whether it succeeded, stalled, or escalated` with higher operator signal than a generic activity stream. The current UI now frames that limitation honestly, but the live payload is still not rich.
- Severity: `medium`, non-blocking for ratification

### 2. Command naming still drifts slightly from the frozen design language

- Evidence: the second tier renders as `Strike Team A President` rather than the wireframe’s `President-A`.
- Why it matters: the hierarchy itself remains clear, but naming drift increases friction between the frozen strategy artifacts and the shipped UI.
- Severity: `low`

## Acceptance matrix

| Criterion | Status      | Evidence                                                                                                                                                                                                               |
| --------- | ----------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| 1         | PASS        | Live DOM shows `Voltaris V2` first, `Strike Team A President` directly beneath, then Alpha director cards below.                                                                                                       |
| 2         | PASS        | The page reads as a control surface first, not as an org-chart poster or same-weight card wall.                                                                                                                        |
| 3         | PASS        | All six mandatory V2 surfaces are present.                                                                                                                                                                             |
| 4         | PASS        | The canopy shows the required slots and leaves unresolved values as `TO VERIFY / UNCONFIRMED`.                                                                                                                         |
| 5         | PASS        | Live Ops uses the explicit taxonomy and avoids `Not working`; unresolved metrics render as gaps.                                                                                                                       |
| 6         | PASS        | Tree nodes expose the required operational summary and leave missing node data explicit.                                                                                                                               |
| 7         | CONDITIONAL | The execution feed is chronological and honestly framed, but the live payload still reads mainly as projected cross-domain activity because most rows do not yet admit mapped Workforce actors or normalized outcomes. |
| 8         | PASS        | The evidence rail shows contract gaps, manifest/config context, receipt coverage, gate result, branch/PR refs, session evidence coverage, and trust notes.                                                             |
| 9         | PASS        | Clicking nodes opens a real inspector drill-down with session-backed detail and explicit missing-field handling.                                                                                                       |
| 10        | PASS        | The first-read operator questions are answerable without drilling into secondary views.                                                                                                                                |
| 11        | PASS        | Trust badges and metric/evidence tiles now scan with one coherent truth taxonomy centered on `Observed`, `Projected`, `Manifest-only`, and `Missing`.                                                                  |
| 12        | PASS        | Empty and unavailable states explain what is missing and why.                                                                                                                                                          |
| 13        | PASS        | Roster, topology, telemetry, and governance read as one system.                                                                                                                                                        |
| 14        | PASS        | The dark neon identity remains intact without sacrificing readability.                                                                                                                                                 |
| 15        | PASS        | The `720px` live probe now shows the main three panels stacked at full width in the required order instead of preserving the desktop three-column body.                                                                |
| 16        | PASS        | `TO VERIFY` and `NEW FIELD NEEDED` areas remain visibly unshipped rather than implied as live truth.                                                                                                                   |
| 17        | PASS        | The page still behaves as the selected `Command Cockpit` direction rather than drifting into a different concept.                                                                                                      |

## Data fidelity observations

- `trustState` is predominantly `projected`, which matches the current contract truth from the landed backend slice.
- `sourceKinds` are explicit and useful: the main live sources surfaced during validation were `openclaw_config`, `openclaw_session_store`, `alpha_roster_manifest`, `sprytly_workforce_team_assignments`, and `activity_events`.
- `updatedAt` is rendered consistently enough for freshness to be visible in both the page body and the drawer.
- `missingFields` is carrying real explanatory weight. The major unresolved areas still exposed by the live UI are:
  - canopy rollups such as approvals and stale/downstream counts
  - live-ops blocker, approval, degraded, offline, queue, receipt, and gate metrics
  - per-node `startedAt` and `lastArtifactRef`
  - evidence rollups such as `receiptCoverageSummary` and `latestGateResult`
  - inspector `runId`, `jobId`, `workspaceRef`, artifact links, receipt links, and governance flags
- The execution feed is contract-honest about unmapped events, but that honesty currently reveals the remaining normalization gap more than it delivers operator signal.

## What clearly matches the wireframe

- `Command Canopy` is visually dominant and command-first.
- `Live Ops Strip` is compact and immediately beneath the canopy.
- `Chain of Command Tree` remains the main anchor, with clear reporting relationships.
- `Evidence + Governance Rail` stays secondary to the command story.
- The inspector behavior matches the intended drill-down model and surfaces provenance before pretending completeness.
- The later President-A team-builder and auto-team-assemble controls extend the command story without displacing the six mandatory V2 surfaces.
- The responsive body now preserves hierarchy by stacking the tree, execution, and evidence panels in order at narrower widths.

## Deployment-readiness recommendation

Ratify this UI for deployment review, not for silent deployment.

The page now clears the frozen acceptance bar well enough to reopen deployment ratification. The responsive blocker is resolved, the trust taxonomy is coherent, and the remaining execution-feed limitation is clearly disclosed in the UI rather than hidden. Deployment approval should still explicitly acknowledge that the current feed is honest-but-projected until richer actor/outcome mapping lands.

## Exact next lane recommendation

`Ratify Workforce Alpha V2 UI for Deployment by reviewing UI_VALIDATION_REPORT.md and authorizing or rejecting the final deployment process to main.`
