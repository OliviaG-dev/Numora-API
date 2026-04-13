import { describe, expect, it, vi } from "vitest";

describe("server configuration", () => {
  it("fails fast when JWT_SECRET is too short", async () => {
    vi.resetModules();
    process.env.JWT_SECRET = "short-secret";

    await expect(import("../src/server")).rejects.toThrow("JWT_SECRET must be at least 32 characters");
  });
});
