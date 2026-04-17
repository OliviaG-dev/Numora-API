import request from "supertest";
import { beforeAll, describe, expect, it } from "vitest";

let app: typeof import("../src/app").app;

beforeAll(async () => {
  process.env.JWT_SECRET = "test_jwt_secret_with_more_than_32_characters";
  process.env.API_RATE_LIMIT_MAX = "10000";
  process.env.API_RATE_LIMIT_WINDOW_MS = "60000";
  process.env.NUMEROLOGY_RATE_LIMIT_MAX = "1000";
  process.env.NUMEROLOGY_RATE_LIMIT_WINDOW_MS = "60000";

  ({ app } = await import("../src/app"));
});

const validCalculateBody = {
  fullName: "Marie Dupont",
  birthDate: "1990-03-15"
};

describe("numerology integration", () => {
  it("calculates a profile for a valid payload", async () => {
    const response = await request(app)
      .post("/api/numerology/calculate")
      .send(validCalculateBody);

    expect(response.status).toBe(200);
    expect(response.body.result).toBeDefined();
    expect(response.body.result.identity).toEqual({
      fullName: validCalculateBody.fullName,
      birthDate: validCalculateBody.birthDate
    });
    expect(response.body.result.core).toMatchObject({
      lifePath: expect.any(Number),
      expression: expect.any(Number),
      soulUrge: expect.any(Number),
      personality: expect.any(Number)
    });
  });

  it("rejects calculate payload with unknown keys (strict schema)", async () => {
    const response = await request(app)
      .post("/api/numerology/calculate")
      .send({
        ...validCalculateBody,
        unexpectedField: true
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Validation error");
    expect(response.body.details).toBeDefined();
  });

  it("rejects calculate when birthDate is not YYYY-MM-DD", async () => {
    const response = await request(app).post("/api/numerology/calculate").send({
      fullName: "Marie Dupont",
      birthDate: "15-03-1990"
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Validation error");
    expect(response.body.details?.fieldErrors?.birthDate).toBeDefined();
  });

  it("rejects calculate when fullName is too short", async () => {
    const response = await request(app).post("/api/numerology/calculate").send({
      fullName: "A",
      birthDate: "1990-03-15"
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Validation error");
    expect(response.body.details?.fieldErrors?.fullName).toBeDefined();
  });

  it("rejects calculate when nested address fields are invalid", async () => {
    const response = await request(app)
      .post("/api/numerology/calculate")
      .send({
        fullName: "Marie Dupont",
        birthDate: "1990-03-15",
        address: {
          streetNumber: "",
          streetName: "Rue de Paris"
        }
      });

    expect(response.status).toBe(400);
    expect(response.body.error).toBe("Validation error");
    expect(response.body.details?.fieldErrors).toBeDefined();
  });

  it("lists numerology datasets", async () => {
    const response = await request(app).get("/api/numerology/data");

    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.datasets)).toBe(true);
    const challenge = response.body.datasets.find(
      (d: { id: string }) => d.id === "challengeData"
    );
    expect(challenge).toMatchObject({
      id: "challengeData",
      kind: "object"
    });
    expect(typeof challenge.size).toBe("number");
  });

  it("returns a full dataset by id", async () => {
    const response = await request(app).get("/api/numerology/data/challengeData");

    expect(response.status).toBe(200);
    expect(response.body.datasetId).toBe("challengeData");
    expect(response.body.dataset).toBeDefined();
    expect(typeof response.body.dataset).toBe("object");
  });

  it("returns 404 for unknown dataset id", async () => {
    const response = await request(app).get(
      "/api/numerology/data/datasetThatDoesNotExist"
    );

    expect(response.status).toBe(404);
    expect(String(response.body.error)).toContain("introuvable");
  });

  it("returns a single object entry by key", async () => {
    const response = await request(app).get("/api/numerology/data/challengeData/1");

    expect(response.status).toBe(200);
    expect(response.body.datasetId).toBe("challengeData");
    expect(response.body.entryKey).toBe("1");
    expect(response.body.entry).toBeDefined();
  });

  it("returns 404 when object entry key is missing", async () => {
    const response = await request(app).get(
      "/api/numerology/data/challengeData/not-a-real-key-99999"
    );

    expect(response.status).toBe(404);
    expect(String(response.body.error)).toContain("introuvable");
  });

  it("returns a single array entry by index", async () => {
    const response = await request(app).get("/api/numerology/data/crystalPathData/0");

    expect(response.status).toBe(200);
    expect(response.body.datasetId).toBe("crystalPathData");
    expect(response.body.entryKey).toBe("0");
    expect(response.body.entry).toBeDefined();
  });

  it("returns 404 for out-of-range array index", async () => {
    const response = await request(app).get(
      "/api/numerology/data/crystalPathData/99999"
    );

    expect(response.status).toBe(404);
    expect(String(response.body.error)).toContain("introuvable");
  });
});
