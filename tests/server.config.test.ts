import { describe, expect, it, vi } from "vitest";

describe("server configuration", () => {
  it("rejects JWT_SECRET shorter than 32 characters", async () => {
    vi.resetModules();
    process.env.JWT_SECRET = "short-secret";

    const { getJwtSecretOrThrow } = await import("../src/utils/auth");

    expect(() => getJwtSecretOrThrow()).toThrow(
      "JWT_SECRET must be at least 32 characters"
    );
  });
});
