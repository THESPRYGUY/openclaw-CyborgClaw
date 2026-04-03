# Strike Team Mission Training Templates

Status: draft execution templates
Depends on:

- `ops/cyborgclaw/STRIKE_TEAM_MISSION_TRAINING_DRILL.md`

Intent: provide the concrete templates required to run the Strike Team simulated mission drill with minimal ambiguity.

## Purpose

This file provides the operator-ready templates for the five-mission Strike Team training drill.

It includes:

1. simulated mission packet template
2. lead acknowledgment template
3. downstream instruction handoff template
4. 60-second sound-off report template
5. per-mission result record template
6. five-mission summary scoreboard template

## Template 1 — simulated mission packet

Use one packet per mission.

```yaml
missionId: TEST-00X
simulation: true
missionType: strike-team-training-drill
submittedTo: STUD
submittedBy: operator
submittedAt: 2026-04-03T00:00:00Z

route:
  targetLead: <lead-id>
  lane: <lane-name>
  team: Strike Team Alpha

objective:
  short: <single-sentence mission objective>
  detail: <2-4 sentence explanation of the simulated assignment>

scope:
  inScope:
    - <item>
    - <item>
  outOfScope:
    - <item>
    - <item>

participants:
  alreadySpawnedAgents:
    - <agent-id>
    - <agent-id>
  agentsToBeSpawned:
    - <agent-role-or-agent-id>
    - <agent-role-or-agent-id>

instructions:
  leadInstructions:
    - <instruction>
    - <instruction>
  downstreamInstructions:
    - target: <agent-id-or-role>
      instructions:
        - <instruction>
        - <instruction>
    - target: <agent-id-or-role>
      instructions:
        - <instruction>

acknowledgmentRequirements:
  requiresReceiptConfirmation: true
  requiresUnderstandingConfirmation: true
  requiresParticipantDeclaration: true

soundOff:
  required: true
  durationSeconds: 60
  managedBy: STUD
  expectedParticipants:
    - <lead-id>
    - <agent-id>
    - <agent-id>

successCriteria:
  - STUD registers intake
  - correct lead receives full packet
  - lead confirms receipt and understanding
  - downstream participants are declared or spawned
  - all expected agents sound off within 60 seconds

failureCriteria:
  - mission bypasses STUD
  - packet is incomplete at handoff
  - lead does not confirm understanding
  - expected agents do not receive instructions
  - sound-off fails or closes incoherently
```

## Template 2 — lead acknowledgment

This should be sent by the target lead after receiving the mission packet.

```yaml
missionId: TEST-00X
leadId: <lead-id>
received: true
understood: true
acknowledgedAt: 2026-04-03T00:00:00Z

missionUnderstanding:
  objectiveSummary: <lead restates the mission in one sentence>
  lane: <lane-name>
  scopeBoundarySummary: <brief boundary summary>

participantPlan:
  alreadyActive:
    - <agent-id>
    - <agent-id>
  toBeSpawned:
    - <agent-role-or-agent-id>
    - <agent-role-or-agent-id>

readiness:
  status: ready
  blockerSummary: none

soundOffReadiness:
  readyForSoundOff: true
  expectedParticipants:
    - <lead-id>
    - <agent-id>
    - <agent-id>
```

## Template 3 — downstream instruction handoff

This is the instruction format the lead can use when passing the mission to subordinate agents.

```yaml
missionId: TEST-00X
fromLead: <lead-id>
toAgent: <agent-id>
roleInMission: <role-label>

instructionBundle:
  objective: <one-sentence objective for this subordinate>
  requiredActions:
    - <action>
    - <action>
  exclusions:
    - <exclusion>
  reportingRequirement: sound-off within 60-second window under STUD management

ackRequired: true
```

## Template 4 — sound-off report

Each participant should use a short structured report during the 60-second window.

```yaml
missionId: TEST-00X
agentId: <agent-id>
seatId: <seat-id>
role: <role-label>
state: ready
blockers: none
note: <optional one-line state note>
reportedAt: 2026-04-03T00:00:00Z
```

### Minimal human-readable sound-off line

If a shorter line is needed, use:

```text
<agent-id> | <mission-id> | <role> | <state> | <blockers-or-no-blockers>
```

Example:

```text
dir-architecture-01 | TEST-003 | architecture lead | ready | no blockers
```

## Template 5 — STUD sound-off control record

STUD should keep a structured record for the sound-off window.

```yaml
missionId: TEST-00X
managedBy: STUD
openedAt: 2026-04-03T00:00:00Z
closedAt: 2026-04-03T00:01:00Z
expectedParticipants:
  - <agent-id>
  - <agent-id>
  - <agent-id>
reportedParticipants:
  - <agent-id>
  - <agent-id>
missingParticipants:
  - <agent-id>
result: pass
notes:
  - <optional note>
```

Recommended `result` values:

- `pass`
- `partial`
- `fail`

## Template 6 — per-mission result record

Use one result record per mission.

```yaml
missionId: TEST-00X
targetLead: <lead-id>
lane: <lane-name>

intake:
  studReceived: true
  intakeRecorded: true

handoff:
  correctLeadTargeted: true
  fullPacketDelivered: true

acknowledgment:
  receiptConfirmed: true
  understandingConfirmed: true
  participantPlanDeclared: true

downstreamActivation:
  instructionsSent: true
  expectedParticipantsKnown: true

soundOff:
  startedCorrectly: true
  durationSeconds: 60
  expectedCount: 0
  reportedCount: 0
  missingCount: 0
  result: pass

overall:
  status: pass
  operatorNotes: <notes>
  followupActions:
    - <action>
    - <action>
```

## Template 7 — five-mission summary scoreboard

Use this to summarize the full drill.

```yaml
drillId: STRIKE-TEAM-DRILL-001
runAt: 2026-04-03T00:00:00Z
mode: simulation
missions:
  - missionId: TEST-001
    targetLead: <lead-id>
    intake: pass
    handoff: pass
    acknowledgment: pass
    soundOff: pass
    overall: pass
  - missionId: TEST-002
    targetLead: <lead-id>
    intake: pass
    handoff: pass
    acknowledgment: pass
    soundOff: partial
    overall: partial
  - missionId: TEST-003
    targetLead: <lead-id>
    intake: pass
    handoff: pass
    acknowledgment: pass
    soundOff: pass
    overall: pass
  - missionId: TEST-004
    targetLead: <lead-id>
    intake: fail
    handoff: fail
    acknowledgment: fail
    soundOff: fail
    overall: fail
  - missionId: TEST-005
    targetLead: <lead-id>
    intake: pass
    handoff: pass
    acknowledgment: pass
    soundOff: pass
    overall: pass

aggregate:
  totalMissions: 5
  passCount: 0
  partialCount: 0
  failCount: 0
  repeatedFailurePatterns:
    - <pattern>
    - <pattern>
  operatorAssessment: <summary>
  nextActions:
    - <action>
    - <action>
```

## Suggested mission id mapping for first run

Recommended first run ids:

- `TEST-001` — architecture lead
- `TEST-002` — application engineering lead
- `TEST-003` — DevEx / QA lead
- `TEST-004` — operations / orchestration lead
- `TEST-005` — review / publish / governance lead

If the actual lead roster differs, preserve the one-to-one mapping but rename the targets accordingly.

## Recommended operating rule

For the first drill, do not improvise packet shape mid-run. Fill these templates and run them consistently so outcomes are comparable across all five missions.

## One-sentence execution rule

**Run every simulated mission using the same packet, acknowledgment, handoff, sound-off, and results templates so the five-lead drill produces comparable and auditable evidence.**
