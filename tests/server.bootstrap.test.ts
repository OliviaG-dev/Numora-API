import { afterEach, describe, expect, it, vi } from "vitest";

describe("server bootstrap", () => {
  const originalNodeEnv = process.env.NODE_ENV;

  afterEach(() => {
    process.env.NODE_ENV = originalNodeEnv;
    vi.resetModules();
  });

  it("loads server in test mode without listening", async () => {
    process.env.JWT_SECRET = "test_jwt_secret_with_more_than_32_characters";
    process.env.NODE_ENV = "test";

    await expect(import("../src/server")).resolves.toBeDefined();
  });
});
