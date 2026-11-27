jest.mock("@/services/dwarf", () => {
  const sdk = jest.requireActual("dwarfii_api");
  return {
    normalizeCurrentDeviceInfo: sdk.normalizeCurrentDeviceInfo,
    deviceInfo: (ip: string) => "http://" + ip + ":8082/deviceInfo",
  };
});
jest.mock("@/services/dwarf/api", () => jest.requireActual("dwarfii_api"));
jest.mock("@/lib/get_proxy_url", () => ({
  getProxyUrl: () => "http://localhost:9000/proxy",
}));

import { findDeviceInfo } from "@/lib/get_dwarf_type";
import {
  applyAuthoritativeCameraParam,
  getV3ActiveParameterNamespace,
  getV3AstroParameterCatalog,
  getV3CameraParameterOptions,
  getV3NormalizedCameraCatalog,
  ingestV3ParameterNotification,
  loadV3AstroParameterCatalog,
  loadV3CameraParameterCatalog,
  resetV3CameraParameterCache,
  resolveScienceFilterIndex,
  summarizeV3CameraCatalog,
} from "@/services/dwarf/cameraParams";
import { encodeCurrentParamId, withCurrentParamMode } from "dwarfii_api";

const rawCatalog =
  '{"code":0,"data":{"cameraParams":[{"cameraId":0,"specialParams":{"exp":{"paramId":144396663052566529,"currentMode":1,"currentValue":120,"values":[{"name":"1","value":120},{"name":"5","value":141}]},"gain":{"paramId":144396663052566530,"currentValue":60,"values":[40,60,100]}},"generalParams":[{"name":"frameCount","paramId":144678138029277200,"currentValue":1,"values":[1,2]}]}]}}';
const fetchMock = jest.fn();
const originalFetch = global.fetch;
const testContexts: any[] = [];

function response(text = rawCatalog, ok = true, status = 200) {
  return {
    ok,
    status,
    text: jest.fn(async () => text),
    json: jest.fn(() => {
      throw new Error("Do not round IDs with response.json()");
    }),
  };
}

function context(ip = "192.0.2.1") {
  const listeners = new Set<(state: any) => void>();
  const session = {
    state: { generation: 1, phase: "ready" },
    subscribe: (listener: (state: any) => void) => {
      listeners.add(listener);
      return () => listeners.delete(listener);
    },
  };
  const connection = {
    IPDwarf: ip,
    socketIPDwarf: { session },
    currentAstroCamera: 0,
    setAstroSettings: jest.fn(),
  } as any;
  testContexts.push(connection);
  return {
    connection,
    advance: () => {
      session.state = {
        generation: session.state.generation + 1,
        phase: "disconnected",
      };
      Array.from(listeners).forEach((listener) => listener(session.state));
    },
  };
}

beforeEach(() => {
  testContexts.splice(0).forEach(resetV3CameraParameterCache);
  fetchMock.mockReset();
  global.fetch = fetchMock;
  jest.spyOn(console, "error").mockImplementation(() => {});
});
afterEach(() => {
  testContexts.splice(0).forEach(resetV3CameraParameterCache);
  global.fetch = originalFetch;
  jest.restoreAllMocks();
});

test("discovery reports a proxy/network failure rather than an unsupported model", async () => {
  fetchMock.mockRejectedValue(new TypeError("Failed to fetch"));
  const failure = jest.fn();
  expect(
    await findDeviceInfo("192.0.2.1", context().connection, failure),
  ).toEqual([undefined, undefined]);
  expect(failure).toHaveBeenCalledWith(
    expect.stringContaining("configured proxy"),
  );
});

test("discovery preserves HTTP diagnostics without exposing the response body", async () => {
  fetchMock.mockResolvedValue(response("private response", false, 502));
  const failure = jest.fn();
  await findDeviceInfo("192.0.2.1", context().connection, failure);
  expect(failure).toHaveBeenCalledWith(expect.stringContaining("HTTP 502"));
  expect(failure.mock.calls[0][0]).not.toContain("private response");
});

test.each(["EHOSTUNREACH", "ENETUNREACH"])(
  "discovery explains macOS proxy network failures (%s)",
  async (code) => {
    fetchMock.mockResolvedValue(
      response(
        JSON.stringify({
          error: "Proxy upstream network unreachable",
          code,
          platform: "darwin",
        }),
        false,
        502,
      ),
    );
    const failure = jest.fn();
    expect(
      await findDeviceInfo("192.0.2.1", context().connection, failure),
    ).toEqual([undefined, undefined]);
    expect(failure).toHaveBeenCalledWith(expect.stringContaining(code));
    expect(failure).toHaveBeenCalledWith(
      expect.stringContaining("Privacy & Security > Local Network"),
    );
    expect(failure).toHaveBeenCalledWith(expect.stringContaining("Terminal"));
    expect(fetchMock).toHaveBeenCalledTimes(1);
  },
);

test("non-macOS proxy network failures do not suggest macOS settings", async () => {
  fetchMock.mockResolvedValue(
    response(
      JSON.stringify({
        error: "Proxy upstream network unreachable",
        code: "EHOSTUNREACH",
        platform: "linux",
      }),
      false,
      502,
    ),
  );
  const failure = jest.fn();
  await findDeviceInfo("192.0.2.1", context().connection, failure);
  expect(failure).toHaveBeenCalledWith(expect.stringContaining("EHOSTUNREACH"));
  expect(failure.mock.calls[0][0]).not.toContain("macOS");
});

test.each([1, 2, 4])(
  "device discovery validates hardware %i and reads raw response text",
  async (hardwareId) => {
    const http = response(
      JSON.stringify({
        code: 0,
        data: { deviceId: hardwareId, deviceName: "DWARF_mini_TEST" },
      }),
    );
    fetchMock.mockResolvedValue(http);
    expect(await findDeviceInfo("192.0.2.1", context().connection)).toEqual([
      hardwareId,
      "TEST",
    ]);
    expect(http.text).toHaveBeenCalledTimes(1);
    expect(http.json).not.toHaveBeenCalled();
    expect(fetchMock).toHaveBeenCalledTimes(1);
    expect(decodeURIComponent(fetchMock.mock.calls[0][0])).toContain(
      ":8082/deviceInfo",
    );
  },
);

test.each([
  { code: -1, data: { deviceId: 4 } },
  { code: 0, data: { deviceId: 99 } },
  { code: 0, data: { deviceName: "DWARF_MINI_TEST" } },
])(
  "failed/unknown device discovery never falls back to media folder guesses",
  async (body) => {
    fetchMock.mockResolvedValue(response(JSON.stringify(body)));
    expect(await findDeviceInfo("192.0.2.1", context().connection)).toEqual([
      undefined,
      undefined,
    ]);
    expect(fetchMock).toHaveBeenCalledTimes(1);
  },
);

test("HTTP failure does not identify a device or fetch old configuration", async () => {
  fetchMock.mockResolvedValue(response("", false, 404));
  expect(await findDeviceInfo("192.0.2.1", context().connection)).toEqual([
    undefined,
    undefined,
  ]);
  expect(fetchMock).toHaveBeenCalledTimes(1);
});

test("catalog discovery retains raw compatibility shape and exact IDs with normalized UI options", async () => {
  const http = response();
  fetchMock.mockResolvedValue(http);
  const { connection } = context();
  const raw: any = await loadV3AstroParameterCatalog(
    connection.IPDwarf,
    connection,
  );
  expect(raw.data.cameraParams[0].specialParams.exp.paramId).toBe(
    "144396663052566529",
  );
  expect(getV3AstroParameterCatalog(connection)).toBe(raw);
  expect(getV3NormalizedCameraCatalog(2, connection)?.modeId).toBe(2);
  expect(
    getV3CameraParameterOptions(0, "exp", 2, connection)?.options?.[0],
  ).toEqual({
    value: 120,
    label: "1",
    seconds: 1,
  });
  expect(http.json).not.toHaveBeenCalled();
  expect(summarizeV3CameraCatalog(raw)[0].settings).toContainEqual({
    label: "Exposure",
    value: "1",
  });
});

test("catalog HTTP and application errors do not populate caches", async () => {
  const { connection } = context();
  fetchMock.mockResolvedValueOnce(response("", false, 503));
  await expect(
    loadV3AstroParameterCatalog(connection.IPDwarf, connection),
  ).rejects.toThrow("503");
  fetchMock.mockResolvedValueOnce(response('{"code":-1,"data":{}}'));
  await expect(
    loadV3AstroParameterCatalog(connection.IPDwarf, connection),
  ).rejects.toThrow("-1");
  expect(getV3AstroParameterCatalog(connection)).toBeUndefined();
});

test("different modes are independently requested and cached", async () => {
  fetchMock.mockResolvedValue(response());
  const { connection } = context();
  await loadV3CameraParameterCatalog(connection.IPDwarf, connection, 8);
  expect(fetchMock.mock.calls[0][1].body).toBe('{"modeId":8}');
  expect(getV3NormalizedCameraCatalog(8, connection)?.modeId).toBe(8);
  expect(getV3NormalizedCameraCatalog(2, connection)).toBeUndefined();
});

test("switching IP or session generation clears catalogs and runtime values", async () => {
  fetchMock.mockResolvedValue(response());
  const first = context();
  await loadV3AstroParameterCatalog(first.connection.IPDwarf, first.connection);
  first.advance();
  expect(getV3AstroParameterCatalog(first.connection)).toBeUndefined();
  const second = context("192.0.2.2");
  await loadV3AstroParameterCatalog(
    second.connection.IPDwarf,
    second.connection,
  );
  expect(
    getV3AstroParameterCatalog(context("192.0.2.3").connection),
  ).toBeUndefined();
});

test("late HTTP results cannot repopulate another device's cache", async () => {
  let finish!: (result: ReturnType<typeof response>) => void;
  fetchMock.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  fetchMock.mockResolvedValueOnce(response());
  const first = context();
  const oldRequest = loadV3AstroParameterCatalog(
    first.connection.IPDwarf,
    first.connection,
  );
  const second = context("192.0.2.2");
  const fresh = await loadV3AstroParameterCatalog(
    second.connection.IPDwarf,
    second.connection,
  );
  first.advance();
  finish(response());
  await expect(oldRequest).rejects.toThrow("previous connection");
  expect(getV3AstroParameterCatalog(second.connection)).toBe(fresh);
});

test("only astronomy camera/category values update their corresponding fields", () => {
  const { connection } = context();
  const parameter = (
    cameraId: number,
    shootingMode: number,
    category: number,
    paramIndex: number,
  ) => ({
    paramId: encodeCurrentParamId({
      cameraId,
      shootingMode,
      category,
      paramIndex,
    }),
    value: 141,
  });
  applyAuthoritativeCameraParam(connection, parameter(0, 8, 1, 1));
  applyAuthoritativeCameraParam(connection, parameter(0, 2, 2, 1));
  applyAuthoritativeCameraParam(connection, parameter(1, 2, 2, 16));
  expect(connection.setAstroSettings).not.toHaveBeenCalled();
  applyAuthoritativeCameraParam(connection, parameter(1, 2, 1, 1));
  const update = connection.setAstroSettings.mock.calls[0][0];
  expect(update({ exposure: 120, gain: 60 })).toEqual({
    exposure: 120,
    gain: 60,
    wideExposure: 141,
  });
});

test("observed runtime namespace requires a matching discovered astronomy parameter", async () => {
  const { connection } = context();
  const parameter = {
    paramId: withCurrentParamMode("144396663052566529", 13),
    value: 141,
  };
  applyAuthoritativeCameraParam(connection, parameter);
  expect(connection.setAstroSettings).not.toHaveBeenCalled();
  fetchMock.mockResolvedValue(response());
  await loadV3AstroParameterCatalog(connection.IPDwarf, connection);
  applyAuthoritativeCameraParam(connection, parameter);
  expect(getV3ActiveParameterNamespace(0, connection)).toBe(13);
  expect(connection.setAstroSettings.mock.calls[0][0]({})).toEqual({
    exposure: 141,
  });
});

test("canonical parameter notifications preserve zero and reject rounded IDs", () => {
  expect(
    ingestV3ParameterNotification({ paramId: "144396663052566529" }),
  ).toEqual({ paramId: "144396663052566529", value: 0, mode: 0 });
  expect(
    ingestV3ParameterNotification({
      paramId: Number("144396663052566529"),
      value: 120,
    }),
  ).toBeUndefined();
});

test("two in-flight device catalogs complete independently without invalidating each other", async () => {
  let finish!: (result: ReturnType<typeof response>) => void;
  fetchMock.mockImplementationOnce(
    () =>
      new Promise((resolve) => {
        finish = resolve;
      }),
  );
  fetchMock.mockResolvedValueOnce(
    response(rawCatalog.replace('"currentValue":120', '"currentValue":141')),
  );
  const a = context("192.0.2.1"),
    b = context("192.0.2.2");
  const pendingA = loadV3AstroParameterCatalog(
    a.connection.IPDwarf,
    a.connection,
  );
  const rawB = await loadV3AstroParameterCatalog(
    b.connection.IPDwarf,
    b.connection,
  );
  finish(response());
  const rawA = await pendingA;
  expect(getV3AstroParameterCatalog(a.connection)).toBe(rawA);
  expect(getV3AstroParameterCatalog(b.connection)).toBe(rawB);
  expect(getV3AstroParameterCatalog()).toBeUndefined();
  a.advance();
  expect(getV3AstroParameterCatalog(a.connection)).toBeUndefined();
  expect(getV3AstroParameterCatalog(b.connection)).toBe(rawB);
});

test("React context replacement keeps the same socket-owned cache", async () => {
  fetchMock.mockResolvedValue(response());
  const { connection } = context();
  const raw = await loadV3AstroParameterCatalog(connection.IPDwarf, connection);
  expect(getV3AstroParameterCatalog({ ...connection })).toBe(raw);
});

test("mismatched discovery address is rejected before HTTP", async () => {
  const { connection } = context();
  await expect(
    loadV3AstroParameterCatalog("192.0.2.99", connection),
  ).rejects.toThrow("does not match");
  expect(fetchMock).not.toHaveBeenCalled();
});

test("disconnect aborts only that socket's pending HTTP request", async () => {
  const a = context("192.0.2.1"),
    b = context("192.0.2.2");
  const pending: ((value: ReturnType<typeof response>) => void)[] = [];
  fetchMock.mockImplementation(
    () => new Promise((resolve) => pending.push(resolve)),
  );
  const requestA = loadV3AstroParameterCatalog(
    a.connection.IPDwarf,
    a.connection,
  );
  const requestB = loadV3AstroParameterCatalog(
    b.connection.IPDwarf,
    b.connection,
  );
  a.advance();
  expect(fetchMock.mock.calls[0][1].signal.aborted).toBe(true);
  expect(fetchMock.mock.calls[1][1].signal.aborted).toBe(false);
  pending[0](response());
  pending[1](response());
  await expect(requestA).rejects.toThrow("previous connection");
  await expect(requestB).resolves.toBeDefined();
});

test.each([
  [1, 0, 0],
  [1, 1, 1],
  [2, 0, 0],
  [2, 1, 1],
  [2, 2, 2],
  [4, 0, 1],
  [4, 1, 2],
])(
  "maps model %i UI filter %i by semantic label to protocol %i",
  (deviceId, uiIndex, wireIndex) => {
    expect(resolveScienceFilterIndex(deviceId, uiIndex)).toBe(wireIndex);
  },
);
test("unknown and Dark science filter selections are not silently coerced", () => {
  expect(() => resolveScienceFilterIndex(4, 2)).toThrow();
  expect(() => resolveScienceFilterIndex(2, -1)).toThrow();
  expect(() => resolveScienceFilterIndex(99, 0)).toThrow();
});
