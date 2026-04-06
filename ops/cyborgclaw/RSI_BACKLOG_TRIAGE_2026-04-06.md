# RSI Backlog Triage - 2026-04-06

Source of truth:

- live Sprytly backlog database at `server/data/sprytly.db`
- real `codex` rubric input
- real `voltaris-v2` rubric input

Starting inventory:

- ideas open: `21`
- todos open: `43`

Cleanup performed:

- ideas archived: `10`
- todos deleted: `7`
- falsely-active todos downgraded to backlog: `2`

Current inventory after cleanup:

- ideas open: `11`
- todos open: `36`

## High-confidence changes applied

### Ideas archived

| id                      | title                                                         | reason                                                  |
| ----------------------- | ------------------------------------------------------------- | ------------------------------------------------------- |
| `dLj0S2mRupw2lHnBZucan` | Sprytly Agent Board + OPS view (OpenClaw backend / better UX) | duplicate exploring idea; promoted lineage survives     |
| `ywLEKcW7vk5NqmRog4aCF` | Sprytly file architecture with built-in RAG                   | duplicate of newer surviving exploration                |
| `2zKPR2289ARikOrdprkL1` | MBTI-driven personality profiles for agent SOUL.md            | duplicate draft                                         |
| `Z8ERabB2iWW8YTPxySutw` | Windows File Explorer-style UI for project/file management    | duplicate draft                                         |
| `nB6npO5rrAh6cyBGRbPJt` | TEST create idea                                              | test junk                                               |
| `tPNGm-edvgadu7bW8Otui` | NEO Intake -> Agent Design Studio (Sprytly)                   | subsumed by surviving Agent Design Studio platform line |
| `CEPaeVjCyWkpdYzZ5btn-` | OpenClaw update decision packet                               | stale one-off decision                                  |
| `4ewy5g-83tQoz28O1Uc4c` | HiveMind UI polish backlog                                    | duplicate of surviving To-Do lane item                  |
| `va4wWKGyt7MkYBP9lU3ha` | Immersive VR collaboration environment                        | out of current strategic lane                           |
| `mNPjz2FQx9VAddjzeeHw5` | VisionClaw exploration                                        | out of current strategic lane                           |

### To-Dos deleted

| id                      | title                                                         | reason                                                          |
| ----------------------- | ------------------------------------------------------------- | --------------------------------------------------------------- |
| `0HwMXeTScboQ16hG5OgnR` | Sprytly Agent Board + OPS view (OpenClaw backend / better UX) | duplicate draft To-Do; newer PRD-ready sibling survives         |
| `6SAVtZXPnU165i2bfjC_S` | 17. OpenClaw update review + upgrade decision                 | stale one-off decision                                          |
| `eLaVRqMXcVlhw5vzpebfp` | 15. VisionClaw exploration                                    | out of current strategic lane                                   |
| `pxU3yeCYpfeqo4IwQPWnG` | 16. Immersive VR collaboration environment exploration        | out of current strategic lane                                   |
| `U-vIVeeJ8_7RZ81rr_hzt` | 12. Enterprise KPI Cascade Groupthink + CEO Dashboard         | weak CyborgClaw system value vs current control-plane needs     |
| `OLJLwNQaYy2ThT0gc0lWh` | 9. Long Drive Control Center in Sprytly Dashboard             | broad, vague, lower leverage than current truth/hardening seams |
| `wFwSQgGOLBXQWgLt44SNN` | 10. SPRYTLY.ai commercialization strategy stream              | outside current CyborgClaw system objective                     |

### Falsely-active To-Dos downgraded to backlog

| id                      | title                                                                    | previous status | new status | reason                                         |
| ----------------------- | ------------------------------------------------------------------------ | --------------- | ---------- | ---------------------------------------------- |
| `J7RrdDBuJP3iG8Wc3G8Ug` | 11. Core KPI: Model->Token->Productivity Efficiency                      | `in_progress`   | `todo`     | no live job/binding backing the active posture |
| `AcKJwrg86UHYI4os_Tvml` | 7. HiveMind ephemeral runtime + external contributors + conference calls | `in_progress`   | `todo`     | no live job/binding backing the active posture |

## Surviving ideas

| rank | id                      | title                                                         | disposition    | note                                                                  |
| ---- | ----------------------- | ------------------------------------------------------------- | -------------- | --------------------------------------------------------------------- |
| 1    | `OAcDpxGLEfx1A8j_Qpuhb` | Sprytly Agent Board + OPS view (OpenClaw backend / better UX) | `keep_lineage` | promoted lineage for surviving PRD-ready To-Do                        |
| 2    | `V9gHJUgH5t-dq2iEFU-wu` | Agent Design Studio                                           | `keep_lineage` | promoted lineage for surviving To-Do                                  |
| 3    | `I94alKUqLrwHNwJVRdbUB` | LLM Model Telemetry Cluster 2026-03-25T13-52-29-347Z          | `resolve_now`  | promoted lineage tied to a completed job but stale open backlog state |
| 4    | `xvOmadlX4nDSeZm2aS4SG` | CyborgClaw Explainer Card                                     | `resolve_now`  | promoted lineage tied to a completed job but stale open backlog state |
| 5    | `vgprtF6UwIgQdaB82u_AH` | Sprytly file architecture with built-in RAG                   | `keep_seeded`  | still materially valuable and bounded enough to packet later          |
| 6    | `Fl3hDt5qd6cjQPyGWtdMn` | ElevenLabs + WhatsApp voice module                            | `keep_seeded`  | still potentially differentiating, but not next                       |
| 7    | `0vKpa3dgJhBU1N7knC4-r` | NEO Intake -> Agent Design Studio (Sprytly)                   | `keep_lineage` | promoted lineage record; do not treat as next new seam                |
| 8    | `lW-OS9a40V6OczMUOA9WM` | MBTI-driven personality profiles for agent SOUL.md            | `hold`         | interesting but weak proof path and low current leverage              |
| 9    | `Ca9Pbk9pxRpZz1eOh9Fe8` | Windows File Explorer-style UI for project/file management    | `hold`         | broad UX ambition, not the best next CyborgClaw seam                  |
| 10   | `c0MEXvxhmpMIjp9W0EyQH` | Rhythmic Memory                                               | `hold`         | speculative and weakly bounded                                        |
| 11   | `C2jvgNvo5UzRThUwbyojt` | Client output toolchain: polishing + infographics             | `hold`         | lower system leverage than current truth/hardening seams              |

## Surviving To-Dos

### Resolve now

| rank | id                      | title                                                | disposition   | note                                                    |
| ---- | ----------------------- | ---------------------------------------------------- | ------------- | ------------------------------------------------------- |
| 1    | `PLoWvKzGsvAeIc8jyGK8N` | LLM Model Telemetry Cluster 2026-03-25T13-52-29-347Z | `resolve_now` | live job is completed; backlog posture still looks open |
| 2    | `40A17ucjW3Gnld7RWf80l` | CyborgClaw Explainer Card                            | `resolve_now` | live job is completed; backlog posture still looks open |

### Advance now

| rank | id                      | title                                                                                              | note                                                              |
| ---- | ----------------------- | -------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------- |
| 1    | `todo-r6u6m87985l`      | [OpenClaw Hardening T1-P6] Fix control-plane drift detection (manifest vs DB vs runtime)           | team vote aligned on this as the next packet                      |
| 2    | `todo-13gq8dwye74`      | [OpenClaw Hardening T1-P4] Lock owner-lane addressing contract (laneKey + ownerSessionId fallback) | high leverage and tightly coupled to drift detection              |
| 3    | `todo-z3rpv90hm2g`      | [OpenClaw Hardening T1-P7] Harden group policy and tool scope for shared chats                     | closes authority leakage risk                                     |
| 4    | `todo-v39cdla4tbh`      | [OpenClaw Hardening T1-P5] Make incident closure dual-gate mandatory                               | improves closeout truth                                           |
| 5    | `todo-w449a4fc62j`      | [OpenClaw Hardening T2-P5] Dev board truth-model alignment                                         | direct operator-truth win                                         |
| 6    | `todo-x235r0uwyp`       | [OpenClaw Hardening T2-P1] Standardize lane-specific tool profiles                                 | broad leverage after truth seams tighten                          |
| 7    | `todo-uhmz35vovjd`      | [OpenClaw Hardening T1-P1] Enable sandboxing for small-model sessions (local14/local32)            | critical safety value; candidate for a later paired safety packet |
| 8    | `todo-yylwe3c9l2n`      | [OpenClaw Hardening T1-P2] Deny web/browser tools for small-model lanes by default                 | natural companion to sandboxing                                   |
| 9    | `todo-kg2u1t1mtok`      | [OpenClaw Hardening T2-P2] Browser reliability hardening                                           | valuable but secondary to control-plane truth                     |
| 10   | `IUdn8tmnl0nuOjadwFRT3` | Housekeeping: Full FLOW code review (Ideas Incubator → To-Dos → Dev Staging)                       | useful audit, but too broad for the very next packet              |
| 11   | `wzwMfTTK4iJNGrXpj4Q7o` | Sprytly Agent Board + OPS view (OpenClaw backend / better UX)                                      | strong product value, lower priority than core truth seams        |
| 12   | `zVrW_Iiy7XLhnT9CnZbTA` | Agent Design Studio                                                                                | important platform work, but not the next reliability seam        |

### Keep seeded

| id                      | title                                                                               | note                                              |
| ----------------------- | ----------------------------------------------------------------------------------- | ------------------------------------------------- |
| `todo-9kkzkcg413r`      | [OpenClaw Hardening T1-P3] Run and enforce OpenClaw security audit deep-fix cadence | important, but less bounded than current top seam |
| `todo-eeaxuai5sbl`      | [OpenClaw Hardening T2-P3] Production release gate template                         | strong follow-on governance packet                |
| `todo-9c2hzf76drj`      | [OpenClaw Hardening T2-P4] Heartbeat SLA escalation automation                      | worth keeping after drift/ownership seams         |
| `todo-yl3mgpyglkp`      | [OpenClaw Hardening T2-P6] Control-plane SLO dashboard                              | valuable once truth seams are tighter             |
| `todo-njm9xiujgj`       | [OpenClaw Hardening T2-P7] Model failover policy codification                       | useful follow-on reliability packet               |
| `todo-jjth5tusy6i`      | [OpenClaw Hardening T3-P1] Runbook pack for top failure modes                       | stronger after first hardening packets land       |
| `todo-odaxa3803dl`      | [OpenClaw Hardening T3-P2] Governance prompt versioning and preflight tests         | keep seeded; likely mid-term governance packet    |
| `todo-ct9p5cfwvb`       | [OpenClaw Hardening T3-P3] Secrets rotation automation and evidence                 | keep seeded; not the very next loop               |
| `todo-qs1u8jjled`       | [OpenClaw Hardening T3-P4] Controlled OpenClaw update cadence                       | keep seeded                                       |
| `todo-508omad23f6`      | [OpenClaw Hardening T3-P5] DM scope hardening rollout                               | keep seeded                                       |
| `todo-o0rwpjnekg8`      | [OpenClaw Hardening T3-P6] Extension relay governance                               | keep seeded, lower urgency                        |
| `RIICIx5NF1ISOdHWRITCX` | UX cleanup: hide queued/in-progress from default To-Do view                         | useful truth polish packet                        |
| `ufiRF3AmHfVMmVqlyzPGc` | 6. ElevenLabs Conversational AI + WhatsApp voice module                             | keep seeded, lower current priority               |
| `nZmZ5GMyvRqFyl1rB1MyP` | 18. HiveMind UI polish backlog capture                                              | keep seeded                                       |
| `_DwDogqSKK3ubRKe7c5fx` | 14. Client output toolchain: doc polish + image/infographics                        | keep seeded                                       |
| `J7RrdDBuJP3iG8Wc3G8Ug` | 11. Core KPI: Model->Token->Productivity Efficiency                                 | corrected from false active to backlog            |
| `AcKJwrg86UHYI4os_Tvml` | 7. HiveMind ephemeral runtime + external contributors + conference calls            | corrected from false active to backlog            |

### Hold

| id                      | title                                                                      | note                                                                      |
| ----------------------- | -------------------------------------------------------------------------- | ------------------------------------------------------------------------- |
| `ZrMwYQePhil-iw0cCG-r_` | Multi modal Executive summary (v0.1)                                       | lower system leverage than current hardening packets                      |
| `BCCrz9jtq6PkqRBN0Ls`   | [WS:AGENT_OPS_CENTER] Agent Ops: Backend salon-summary API + parser        | narrow sub-slice likely subsumed by broader Agent Board packet            |
| `qDiXAK9UYHrRY0q7PZE`   | [WS:AGENT_OPS_CENTER] Agent Ops: UI tile View Report + detail modal action | hold until parent Agent Board packet is active                            |
| `g8ribKRLaDoyy6K_Dh8`   | [WS:AGENT_OPS_CENTER] Agent Ops: Hover executive summary panel + telemetry | hold until parent Agent Board packet is active                            |
| `todo-3212e031c9c1`     | Agent Design Studio Feature — PRD + Dev Pack v1                            | older line item likely superseded by the newer Agent Design Studio packet |

## Team vote on the next packet

Real `codex` top recommendation:

- control-plane drift detection first

Real `voltaris-v2` top recommendation:

- control-plane drift detection first

Mission lead recommendation:

- control-plane drift detection first

Converged next packet:

- `todo-r6u6m87985l`
- `[OpenClaw Hardening T1-P6] Fix control-plane drift detection (manifest vs DB vs runtime)`

## Why that seam wins now

- It tightens operator truth directly.
- It makes several adjacent items easier to prove later.
- It has strong leverage across routing, ownership, state, and UI truth.
- It is smaller and cleaner than broad feature work like Agent Board, Agent Design Studio, or a full FLOW review.
