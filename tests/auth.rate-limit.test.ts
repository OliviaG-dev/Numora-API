import request from "supertest";
import { beforeAll, describe, expect, it, vi } from "vitest";

let app: typeof import("../src/app").app;

beforeAll(async () => {
  vi.resetModules();
  process.env.JWT_SECRET = "test_jwt_secret_with_more_than_32_characters";
  process.env.AUTH_RATE_LIMIT_WINDOW_MS = "60000";
  process.env.AUTH_RATE_LIMIT_MAX = "2";

  ({ app } = await import("../src/app"));
});

describe("auth rate limit", () => {
  it("returns 429 after too many auth attempts", async () => {
    const firstResponse = await request(app).post("/api/auth/login").send({});
    const secondResponse = await request(app).post("/api/auth/login").send({});
    const thirdResponse = await request(app).post("/api/auth/login").send({});

    expect(firstResponse.status).toBe(400);
    expect(secondResponse.status).toBe(400);
    expect(thirdResponse.status).toBe(429);
    expect(thirdResponse.body.error).toBe("Too many authentication attempts, please retry later");
  });
});
