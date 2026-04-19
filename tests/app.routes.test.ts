import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";

let app: typeof import("../src/app").app;

beforeAll(async () => {
  process.env.JWT_SECRET = "test_jwt_secret_with_more_than_32_characters";
  process.env.API_RATE_LIMIT_MAX = "10000";
  process.env.API_RATE_LIMIT_WINDOW_MS = "60000";

  ({ app } = await import("../src/app"));
});

describe("app routes", () => {
  it("GET / returns service info", async () => {
    const response = await request(app).get("/");

    expect(response.status).toBe(200);
    expect(response.body).toEqual({
      message: "Numora API is running",
      docs: "/api/docs"
    });
  });

  it("GET /api/docs/openapi.json returns OpenAPI document", async () => {
    const response = await request(app).get("/api/docs/openapi.json");

    expect(response.status).toBe(200);
    expect(response.body).toBeTypeOf("object");
    expect(response.body).toHaveProperty("openapi");
  });
});
