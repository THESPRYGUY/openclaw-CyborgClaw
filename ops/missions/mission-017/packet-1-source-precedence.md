# Mission 017 Packet 1 - Golden Run Source Precedence

## Public truth-posture contract

Packet 1 exposes exactly these operator-facing telemetry postures:

- `live`
- `derived`
- `stale`
- `unknown`

`fallback` is no longer a public Golden Run posture. If older helpers still emit
`fallback` internally, the shared contract normalizes it to `unknown` before it
reaches the board, API payloads, or systems check receipts.

## Canonical precedence table

| Field                     | Source 1                                  | Source 2                | Source 3              | Source 4                           | Source 5  |
| ------------------------- | ----------------------------------------- | ----------------------- | --------------------- | ---------------------------------- | --------- |
| Hero object / title       | Active workforce mission or runtime truth | Live flow payload truth | Build aggregate truth | Admitted persisted mission summary | `unknown` |
| Current phase / phase key | Active workforce mission or runtime truth | Live flow payload truth | Build aggregate truth | Admitted persisted mission summary | `unknown` |
| Touchpoint status         | Active workforce mission or runtime truth | Live flow payload truth | Build aggregate truth | Admitted persisted mission summary | `unknown` |
| Touchpoint detail         | Active workforce mission or runtime truth | Live flow payload truth | Build aggregate truth | Admitted persisted mission summary | `unknown` |
| Touchpoint count label    | Active workforce mission or runtime truth | Live flow payload truth | Build aggregate truth | Admitted persisted mission summary | `unknown` |
| Touchpoint progress       | Active workforce mission or runtime truth | Live flow payload truth | Build aggregate truth | Admitted persisted mission summary | `unknown` |
| Touchpoint dependency     | Active workforce mission or runtime truth | Live flow payload truth | Build aggregate truth | Admitted persisted mission summary | `unknown` |
| Touchpoint telemetry mode | Active workforce mission or runtime truth | Live flow payload truth | Build aggregate truth | Admitted persisted mission summary | `unknown` |

## Packet-1 notes

- Active-mission anchoring no longer depends on the stronger `focusCanaryLive`
  test. If a workforce mission is admitted, the board stays mission-anchored and
  degrades to `derived` or `unknown` instead of dropping back to unrelated idea
  posture.
- Dependency guardrails remain unchanged. Packet 1 hardens truth posture and
  source precedence only.
