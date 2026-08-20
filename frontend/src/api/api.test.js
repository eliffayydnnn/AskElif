import { describe, it, expect, vi, beforeEach } from "vitest";

const requestUse = vi.fn();
const responseUse = vi.fn();

vi.mock("axios", () => ({
  default: {
    create: vi.fn(() => ({
      interceptors: {
        request: { use: (...args) => requestUse(...args) },
        response: { use: (...args) => responseUse(...args) },
      },
    })),
  },
}));

describe("api axios interceptor", () => {
  beforeEach(async () => {
    vi.resetModules();
    localStorage.clear();
    requestUse.mockClear();
    responseUse.mockClear();

    Object.defineProperty(window, "location", {
      configurable: true,
      writable: true,
      value: { href: "http://localhost/dashboard" },
    });

    await import("./api.js");
  });

  it("401 geldiğinde token siler ve login sayfasına yönlendirir", async () => {
    localStorage.setItem("token", "expired-token");

    const errorHandler = responseUse.mock.calls[0][1];
    await expect(
      errorHandler({ response: { status: 401 } })
    ).rejects.toEqual({ response: { status: 401 } });

    expect(localStorage.getItem("token")).toBeNull();
    expect(window.location.href).toBe("/");
  });

  it("istek öncesi token varsa Authorization header ekler", () => {
    localStorage.setItem("token", "valid-token");

    const requestHandler = requestUse.mock.calls[0][0];
    const config = requestHandler({ headers: {} });

    expect(config.headers.Authorization).toBe("Bearer valid-token");
  });
});
