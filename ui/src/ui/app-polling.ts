import type { OpenClawApp } from "./app.ts";
import { loadAgents } from "./controllers/agents.ts";
import { loadConfig } from "./controllers/config.ts";
import { loadDebug } from "./controllers/debug.ts";
import { loadLogs } from "./controllers/logs.ts";
import { loadNodes } from "./controllers/nodes.ts";

const AGENTS_POLL_INTERVAL_MS = 3000;

type PollingHost = {
  nodesPollInterval: number | null;
  logsPollInterval: number | null;
  debugPollInterval: number | null;
  agentsPollInterval: number | null;
  tab: string;
  configFormDirty?: boolean;
  configLoading?: boolean;
  configSaving?: boolean;
};

export function startNodesPolling(host: PollingHost) {
  if (host.nodesPollInterval != null) {
    return;
  }
  host.nodesPollInterval = window.setInterval(
    () => void loadNodes(host as unknown as OpenClawApp, { quiet: true }),
    5000,
  );
}

export function stopNodesPolling(host: PollingHost) {
  if (host.nodesPollInterval == null) {
    return;
  }
  clearInterval(host.nodesPollInterval);
  host.nodesPollInterval = null;
}

export function startLogsPolling(host: PollingHost) {
  if (host.logsPollInterval != null) {
    return;
  }
  host.logsPollInterval = window.setInterval(() => {
    if (host.tab !== "logs") {
      return;
    }
    void loadLogs(host as unknown as OpenClawApp, { quiet: true });
  }, 2000);
}

export function stopLogsPolling(host: PollingHost) {
  if (host.logsPollInterval == null) {
    return;
  }
  clearInterval(host.logsPollInterval);
  host.logsPollInterval = null;
}

export function startDebugPolling(host: PollingHost) {
  if (host.debugPollInterval != null) {
    return;
  }
  host.debugPollInterval = window.setInterval(() => {
    if (host.tab !== "debug") {
      return;
    }
    void loadDebug(host as unknown as OpenClawApp);
  }, 3000);
}

export function stopDebugPolling(host: PollingHost) {
  if (host.debugPollInterval == null) {
    return;
  }
  clearInterval(host.debugPollInterval);
  host.debugPollInterval = null;
}

export function startAgentsPolling(host: PollingHost) {
  if (host.agentsPollInterval != null) {
    return;
  }
  host.agentsPollInterval = window.setInterval(() => {
    if (host.tab !== "agents") {
      return;
    }
    if (typeof document !== "undefined" && document.visibilityState === "hidden") {
      return;
    }
    void loadAgents(host as unknown as OpenClawApp);
    if (host.configFormDirty || host.configLoading || host.configSaving) {
      return;
    }
    void loadConfig(host as unknown as OpenClawApp);
  }, AGENTS_POLL_INTERVAL_MS);
}

export function stopAgentsPolling(host: PollingHost) {
  if (host.agentsPollInterval == null) {
    return;
  }
  clearInterval(host.agentsPollInterval);
  host.agentsPollInterval = null;
}
