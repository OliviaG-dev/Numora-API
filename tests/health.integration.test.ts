import request from "supertest";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

const prismaMock = {
  $queryRaw: vi.fn()
};

vi.mock("../src/utils/prisma", () => ({
  prisma: prismaMock
}));

let app: typeof import("../src/app").app;

beforeAll(async () => {
  process.env.JWT_SECRET = "test_jwt_secret_with_more_than_32_characters";
  process.env.API_RATE_LIMIT_MAX = "10000";
  process.env.API_RATE_LIMIT_WINDOW_MS = "60000";

  ({ app } = await import("../src/app"));
});

beforeEach(() => {
  vi.clearAllMocks();
});

describe("GET /api/ping", () => {
  it("reports database connected when query succeeds", async () => {
    prismaMock.$queryRaw.mockResolvedValueOnce(undefined);

    const response = await request(app).get("/api/ping");

    expect(response.status).toBe(200);
    expect(response.body).toMatchObject({
      ok: true,
      service: "numora-api",
      database: { connected: true }
    });
    expect(typeof response.body.timestamp).toBe("string");
  });

  it("reports database disconnected when query fails", async () => {
    prismaMock.$queryRaw.mockRejectedValueOnce(new Error("db unavailable"));

    const response = await request(app).get("/api/ping");

    expect(response.status).toBe(200);
    expect(response.body.database.connected).toBe(false);
  });
});
