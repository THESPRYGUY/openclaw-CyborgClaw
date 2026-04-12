import { resolveDefaultAgentId } from "../../agents/agent-scope.js";
import { getHealthSnapshot, type HealthSummary } from "../../commands/health.js";
import { STATE_DIR, createConfigIO, loadConfig } from "../../config/config.js";
import { resolveMainSessionKey } from "../../config/sessions.js";
import { listSystemPresence } from "../../infra/system-presence.js";
import { getUpdateAvailable } from "../../infra/update-startup.js";
import { normalizeMainKey } from "../../routing/session-key.js";
import { resolveGatewayAuth } from "../auth.js";
import type { Snapshot } from "../protocol/index.js";
import type { ChannelRuntimeSnapshot } from "../server-channel-runtime.types.js";

let presenceVersion = 1;
let healthVersion = 1;
let healthCache: HealthSummary | null = null;
let healthRefresh: {
  promise: Promise<HealthSummary>;
  probe: boolean;
  hasRuntimeSnapshot: boolean;
  seq: number;
} | null = null;
let broadcastHealthUpdate: ((snap: HealthSummary) => void) | null = null;
let nextHealthRefreshSeq = 1;
let latestAppliedHealthRefreshSeq = 0;

export function buildGatewaySnapshot(opts?: { includeSensitive?: boolean }): Snapshot {
  const cfg = loadConfig();
  const defaultAgentId = resolveDefaultAgentId(cfg);
  const mainKey = normalizeMainKey(cfg.session?.mainKey);
  const mainSessionKey = resolveMainSessionKey(cfg);
  const scope = cfg.session?.scope ?? "per-sender";
  const presence = listSystemPresence();
  const uptimeMs = Math.round(process.uptime() * 1000);
  const updateAvailable = getUpdateAvailable() ?? undefined;
  // Health is async; caller should await getHealthSnapshot and replace later if needed.
  const emptyHealth: unknown = {};
  const snapshot: Snapshot = {
    presence,
    health: emptyHealth,
    stateVersion: { presence: presenceVersion, health: healthVersion },
    uptimeMs,
    sessionDefaults: {
      defaultAgentId,
      mainKey,
      mainSessionKey,
      scope,
    },
    updateAvailable,
  };
  if (opts?.includeSensitive === true) {
    const auth = resolveGatewayAuth({ authConfig: cfg.gateway?.auth, env: process.env });
    // Surface resolved paths only to admin callers that already have broader gateway access.
    snapshot.configPath = createConfigIO().configPath;
    snapshot.stateDir = STATE_DIR;
    snapshot.authMode = auth.mode;
  }
  return snapshot;
}

export function getHealthCache(): HealthSummary | null {
  return healthCache;
}

export function getHealthVersion(): number {
  return healthVersion;
}

export function incrementPresenceVersion(): number {
  presenceVersion += 1;
  return presenceVersion;
}

export function getPresenceVersion(): number {
  return presenceVersion;
}

export function setBroadcastHealthUpdate(fn: ((snap: HealthSummary) => void) | null) {
  broadcastHealthUpdate = fn;
}

export async function refreshGatewayHealthSnapshot(opts?: {
  probe?: boolean;
  runtimeSnapshot?: ChannelRuntimeSnapshot;
}) {
  const wantsProbe = opts?.probe === true;
  const hasRuntimeSnapshot = opts?.runtimeSnapshot !== undefined;
  const currentRefresh = healthRefresh;
  const canReuseRefresh =
    currentRefresh &&
    // Plain background refreshes can happily reuse any in-flight refresh.
    ((!wantsProbe && !hasRuntimeSnapshot) ||
      // Fresh probe/runtime-backed reads should only reuse another refresh that
      // is already carrying probe-grade runtime truth.
      currentRefresh.probe ||
      currentRefresh.hasRuntimeSnapshot);
  if (!canReuseRefresh) {
    const seq = nextHealthRefreshSeq++;
    const refreshState = {
      probe: wantsProbe,
      hasRuntimeSnapshot,
      seq,
      promise: (async () => {
        const snap = await getHealthSnapshot({
          probe: opts?.probe,
          runtimeSnapshot: opts?.runtimeSnapshot,
        });
        if (seq >= latestAppliedHealthRefreshSeq) {
          latestAppliedHealthRefreshSeq = seq;
          healthCache = snap;
          healthVersion += 1;
          if (broadcastHealthUpdate) {
            broadcastHealthUpdate(snap);
          }
        }
        return snap;
      })().finally(() => {
        if (healthRefresh?.seq === seq) {
          healthRefresh = null;
        }
      }),
    };
    healthRefresh = refreshState;
  }
  return healthRefresh!.promise;
}
