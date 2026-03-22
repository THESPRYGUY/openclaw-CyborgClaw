/* @vitest-environment jsdom */

import { afterEach, describe, expect, it, vi } from "vitest";

const { loadAgentsMock, loadConfigMock } = vi.hoisted(() => ({
  loadAgentsMock: vi.fn(),
  loadConfigMock: vi.fn(),
}));

vi.mock("../../ui/src/ui/controllers/agents.ts", () => ({
  loadAgents: loadAgentsMock,
}));

vi.mock("../../ui/src/ui/controllers/config.ts", () => ({
  loadConfig: loadConfigMock,
}));

import { startAgentsPolling, stopAgentsPolling } from "../../ui/src/ui/app-polling.ts";

function createHost() {
  return {
    agentsPollInterval: null as number | null,
    nodesPollInterval: null as number | null,
    logsPollInterval: null as number | null,
    debugPollInterval: null as number | null,
    tab: "agents",
    configFormDirty: false,
    configLoading: false,
    configSaving: false,
  };
}

describe("startAgentsPolling", () => {
  afterEach(() => {
    vi.useRealTimers();
    vi.restoreAllMocks();
    loadAgentsMock.mockReset();
    loadConfigMock.mockReset();
  });

  it("refreshes agents and config while the agents tab is active", async () => {
    vi.useFakeTimers();
    const host = createHost();

    startAgentsPolling(host);
    await vi.advanceTimersByTimeAsync(3000);

    expect(loadAgentsMock).toHaveBeenCalledTimes(1);
    expect(loadConfigMock).toHaveBeenCalledTimes(1);

    stopAgentsPolling(host);
  });

  it("skips config refresh while the form has unsaved edits", async () => {
    vi.useFakeTimers();
    const host = createHost();
    host.configFormDirty = true;

    startAgentsPolling(host);
    await vi.advanceTimersByTimeAsync(3000);

    expect(loadAgentsMock).toHaveBeenCalledTimes(1);
    expect(loadConfigMock).not.toHaveBeenCalled();

    stopAgentsPolling(host);
  });

  it("does not poll after leaving the agents tab", async () => {
    vi.useFakeTimers();
    const host = createHost();

    startAgentsPolling(host);
    host.tab = "chat";
    await vi.advanceTimersByTimeAsync(3000);

    expect(loadAgentsMock).not.toHaveBeenCalled();
    expect(loadConfigMock).not.toHaveBeenCalled();

    stopAgentsPolling(host);
  });
});
