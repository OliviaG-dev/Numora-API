import { afterEach, describe, expect, it, vi } from "vitest";

describe("auth helpers", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
    vi.resetModules();
  });

  it("getPasswordValidationError covers each password rule", async () => {
    const { getPasswordValidationError } = await import("../src/utils/auth");

    expect(getPasswordValidationError("short")).toContain("at least 10");
    expect(getPasswordValidationError("lowercaseonly1")).toContain("uppercase");
    expect(getPasswordValidationError("UPPERCASEONLY1")).toContain("lowercase");
    expect(getPasswordValidationError("NoDigitsHereAa")).toContain("number");
    expect(getPasswordValidationError("ValidPass123")).toBeNull();
  });

  it("getJwtSecretOrThrow when JWT_SECRET is missing", async () => {
    vi.stubEnv("JWT_SECRET", "");
    const { getJwtSecretOrThrow } = await import("../src/utils/auth");

    expect(() => getJwtSecretOrThrow()).toThrow("JWT_SECRET is not configured");
  });

  it("signAccessToken uses default TTL when JWT_EXPIRES_IN is unset", async () => {
    vi.stubEnv("JWT_SECRET", "test_jwt_secret_with_more_than_32_characters");
    vi.stubEnv("JWT_EXPIRES_IN", "");
    const auth = await import("../src/utils/auth");
    const jwt = await import("jsonwebtoken");

    const token = auth.signAccessToken({ sub: "u1", email: "a@b.com" });
    const decoded = jwt.decode(token) as { exp?: number; iat?: number };

    expect(decoded.exp).toBeDefined();
    expect(decoded.iat).toBeDefined();
    expect(decoded.exp! - decoded.iat!).toBeGreaterThan(60 * 60 * 24 * 6);
  });
});
