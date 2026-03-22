/* @vitest-environment jsdom */

import { beforeEach, describe, expect, it, vi } from "vitest";

const {
  applySettingsFromUrlMock,
  connectGatewayMock,
  loadBootstrapMock,
  startAgentsPollingMock,
  stopAgentsPollingMock,
  startNodesPollingMock,
  stopNodesPollingMock,
} = vi.hoisted(() => ({
  applySettingsFromUrlMock: vi.fn(),
  connectGatewayMock: vi.fn(),
  loadBootstrapMock: vi.fn(),
  startAgentsPollingMock: vi.fn(),
  stopAgentsPollingMock: vi.fn(),
  startNodesPollingMock: vi.fn(),
  stopNodesPollingMock: vi.fn(),
}));

vi.mock("../../ui/src/ui/app-gateway.ts", () => ({
  connectGateway: connectGatewayMock,
}));

vi.mock("../../ui/src/ui/controllers/control-ui-bootstrap.ts", () => ({
  loadControlUiBootstrapConfig: loadBootstrapMock,
}));

vi.mock("../../ui/src/ui/app-settings.ts", () => ({
  applySettingsFromUrl: applySettingsFromUrlMock,
  attachThemeListener: vi.fn(),
  detachThemeListener: vi.fn(),
  inferBasePath: vi.fn(() => "/"),
  syncTabWithLocation: vi.fn(),
  syncThemeWithSettings: vi.fn(),
}));

vi.mock("../../ui/src/ui/app-polling.ts", () => ({
  startAgentsPolling: startAgentsPollingMock,
  startLogsPolling: vi.fn(),
  startNodesPolling: startNodesPollingMock,
  stopAgentsPolling: stopAgentsPollingMock,
  stopLogsPolling: vi.fn(),
  stopNodesPolling: stopNodesPollingMock,
  startDebugPolling: vi.fn(),
  stopDebugPolling: vi.fn(),
}));

vi.mock("../../ui/src/ui/app-scroll.ts", () => ({
  observeTopbar: vi.fn(),
  scheduleChatScroll: vi.fn(),
  scheduleLogsScroll: vi.fn(),
}));

import { handleConnected, handleDisconnected } from "../../ui/src/ui/app-lifecycle.ts";

function createHost(tab: "chat" | "agents" = "chat") {
  return {
    basePath: "",
    client: { stop: vi.fn() },
    connectGeneration: 0,
    connected: true,
    tab,
    assistantName: "OpenClaw",
    assistantAvatar: null,
    assistantAgentId: null,
    serverVersion: null,
    chatHasAutoScrolled: false,
    chatManualRefreshInFlight: false,
    chatLoading: false,
    chatMessages: [],
    chatToolMessages: [],
    chatStream: "",
    logsAutoFollow: false,
    logsAtBottom: true,
    logsEntries: [],
    popStateHandler: vi.fn(),
    topbarObserver: { disconnect: vi.fn() },
  };
}

describe("agents lifecycle polling", () => {
  beforeEach(() => {
    applySettingsFromUrlMock.mockReset();
    connectGatewayMock.mockReset();
    loadBootstrapMock.mockResolvedValue(undefined);
    startAgentsPollingMock.mockReset();
    stopAgentsPollingMock.mockReset();
    startNodesPollingMock.mockReset();
    stopNodesPollingMock.mockReset();
  });

  it("starts agents polling when the agents tab is active on connect", async () => {
    const host = createHost("agents");

    handleConnected(host as never);
    await Promise.resolve();

    expect(startNodesPollingMock).toHaveBeenCalledTimes(1);
    expect(startAgentsPollingMock).toHaveBeenCalledTimes(1);
  });

  it("stops agents polling on disconnect", () => {
    const host = createHost("agents");

    handleDisconnected(host as never);

    expect(stopNodesPollingMock).toHaveBeenCalledTimes(1);
    expect(stopAgentsPollingMock).toHaveBeenCalledTimes(1);
  });
});
