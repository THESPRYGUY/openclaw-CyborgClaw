import { beforeEach, describe, expect, it, vi } from "vitest";
import type { HealthSummary } from "../../commands/health.js";

type Deferred<T> = {
  promise: Promise<T>;
  resolve: (value: T) => void;
};

function createDeferred<T>(): Deferred<T> {
  let resolve!: (value: T) => void;
  const promise = new Promise<T>((res) => {
    resolve = res;
  });
  return { promise, resolve };
}

describe("gateway health state", () => {
  beforeEach(() => {
    vi.resetModules();
    vi.clearAllMocks();
  });

  it("starts a fresh probe refresh instead of reusing a stale background refresh", async () => {
    const background = createDeferred<HealthSummary>();
    const probe = createDeferred<HealthSummary>();
    const calls: Array<{ probe?: boolean; runtimeSnapshot?: unknown }> = [];

    vi.doMock("../../commands/health.js", () => ({
      getHealthSnapshot: vi.fn((opts?: { probe?: boolean; runtimeSnapshot?: unknown }) => {
        calls.push({
          probe: opts?.probe,
          runtimeSnapshot: opts?.runtimeSnapshot,
        });
        return opts?.probe ? probe.promise : background.promise;
      }),
    }));

    const mod = await import("./health-state.js");
    const runtimeSnapshot = { channels: {} };

    const backgroundRefresh = mod.refreshGatewayHealthSnapshot({ probe: false });
    const probeRefresh = mod.refreshGatewayHealthSnapshot({
      probe: true,
      runtimeSnapshot: runtimeSnapshot as never,
    });

    expect(calls).toEqual([
      { probe: false, runtimeSnapshot: undefined },
      { probe: true, runtimeSnapshot },
    ]);

    const probeSnap = { ok: true, ts: 200 } as HealthSummary;
    probe.resolve(probeSnap);
    await expect(probeRefresh).resolves.toBe(probeSnap);
    expect(mod.getHealthCache()).toBe(probeSnap);

    const backgroundSnap = { ok: true, ts: 100 } as HealthSummary;
    background.resolve(backgroundSnap);
    await expect(backgroundRefresh).resolves.toBe(backgroundSnap);
    expect(mod.getHealthCache()).toBe(probeSnap);
  });

  it("reuses a runtime-backed in-flight refresh for later probe requests", async () => {
    const refresh = createDeferred<HealthSummary>();
    const getHealthSnapshot = vi.fn(
      (_opts?: { probe?: boolean; runtimeSnapshot?: unknown }) => refresh.promise,
    );

    vi.doMock("../../commands/health.js", () => ({
      getHealthSnapshot,
    }));

    const mod = await import("./health-state.js");
    const runtimeSnapshot = { channels: { whatsapp: {} } };

    const first = mod.refreshGatewayHealthSnapshot({
      probe: true,
      runtimeSnapshot: runtimeSnapshot as never,
    });
    const second = mod.refreshGatewayHealthSnapshot({
      probe: true,
      runtimeSnapshot: runtimeSnapshot as never,
    });

    expect(getHealthSnapshot).toHaveBeenCalledTimes(1);
    const snap = { ok: true, ts: 300 } as HealthSummary;
    refresh.resolve(snap);
    await expect(first).resolves.toBe(snap);
    await expect(second).resolves.toBe(snap);
  });
});
