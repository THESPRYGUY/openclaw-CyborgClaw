# REHYDRATION_BRIEF

## Purpose

Give the next operator the shortest safe restart path for the current Workforce Alpha V2 build state.

## Read in this order

1. `BUILD_PROGRESS_CLOSEOUT.md`
2. `mission.yaml`
3. `07_HANDOVER_ADDENDUM.md`
4. `RECEIPTS_INDEX.md`
5. `SESSION_MAP.json`
6. `DATA_CONTRACTS_AND_APIS_PLAN.md`
7. `UI_VALIDATION_REPORT.md`

## Repo split

### `openclaw`

This repo now carries:

- the Workforce Alpha V2 mission pack
- the continuity / receipt / rehydration trail
- the smaller OpenClaw Control UI model-sync fix

### sibling `sprytly-internal-dashboard`

That repo now carries the main Workforce Alpha V2 product implementation:

- backend Workforce routes
- cockpit UI
- Voltaris unified control tile
- President-A team builder
- seat-level model-policy controls
- President-A `Auto team assemble`

## Current runtime entry

- Server origin: `http://127.0.0.1:18792`
- Laptop tunnel command:

```bash
ssh -L 18792:127.0.0.1:18792 spryguyt@voltaris
```

- Page route:

```text
http://127.0.0.1:18792/mission-control/workforce/alpha
```

## First safe verification moves

### In the sibling Sprytly repo

1. run `pnpm build`
2. confirm the server is serving the current bundle on `127.0.0.1:18792`
3. verify:
   - `GET /api/mission-control/workforce/alpha/snapshot`
   - `GET /api/mission-control/workforce/alpha/execution`
   - `GET /api/mission-control/workforce/alpha/inspector?nodeId=president-a`
4. review:
   - `evidence/ui-hardening-2026-03-22/desktop.png`
   - `evidence/ui-hardening-2026-03-22/responsive-720.png`
   - `evidence/ui-hardening-2026-03-22/validation.json`
   - `evidence/ui-hardening-2026-03-22/layout-positions.json`

### In `openclaw`

1. re-read `BUILD_PROGRESS_CLOSEOUT.md`
2. re-read `UI_VALIDATION_REPORT.md`
3. confirm the keep/drop list still matches the working tree
4. do not treat `data/sprytly.db` as a source artifact

## Do not assume

- do not assume the current build is approved for deployment just because it is now ready for deployment ratification
- do not assume runtime DB contents belong in the preserved artifact set
- do not assume the predecessor `cnv-mission-2-mission-control-ui` notes are required for the current build closeout

## Current bounded next action

`Ratify Workforce Alpha V2 UI for Deployment by reviewing UI_VALIDATION_REPORT.md and authorizing or rejecting the final deployment process to main.`

## What good looks like

The next operator can restart cold in minutes, open the right repo for the right task, trust the preserved closeout package, and continue directly into the bounded deployment-ratification lane without reconstructing prior decisions from chat logs.
