import request from "supertest";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

type StoredUser = {
  id: string;
  email: string;
  password: string;
  createdAt: Date;
};

type StoredReading = {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  category: "life-path" | "compatibility" | "forecast" | "custom";
  results: Record<string, unknown>;
  createdAt: Date;
};

type UserQuery = {
  where: {
    id?: string;
    email?: string;
  };
  select: {
    id?: boolean;
    email?: boolean;
    password?: boolean;
    createdAt?: boolean;
  };
};

const prismaMock = {
  user: {
    create: vi.fn(),
    findUnique: vi.fn()
  },
  reading: {
    findMany: vi.fn(),
    create: vi.fn(),
    findFirst: vi.fn(),
    deleteMany: vi.fn()
  }
};

vi.mock("../src/utils/prisma", () => ({
  prisma: prismaMock
}));

let app: typeof import("../src/app").app;
let users: StoredUser[] = [];
let readings: StoredReading[] = [];

beforeAll(async () => {
  process.env.JWT_SECRET = "test_jwt_secret_with_more_than_32_characters";
  process.env.JWT_EXPIRES_IN = "7d";
  process.env.AUTH_RATE_LIMIT_MAX = "1000";
  process.env.AUTH_RATE_LIMIT_WINDOW_MS = "60000";

  ({ app } = await import("../src/app"));
});

beforeEach(() => {
  users = [];
  readings = [];
  vi.clearAllMocks();

  prismaMock.user.create.mockImplementation(
    async (args: UserQuery & { data: { email: string; password: string } }) => {
      const now = new Date();
      const user: StoredUser = {
        id: `user_${users.length + 1}`,
        email: args.data.email,
        password: args.data.password,
        createdAt: now
      };

      users.push(user);

      return {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt
      };
    }
  );

  prismaMock.user.findUnique.mockImplementation(async (args: UserQuery) => {
    const found = users.find((user) => {
      if (args.where.id) {
        return user.id === args.where.id;
      }

      if (args.where.email) {
        return user.email === args.where.email;
      }

      return false;
    });

    if (!found) {
      return null;
    }

    return {
      ...(args.select.id ? { id: found.id } : {}),
      ...(args.select.email ? { email: found.email } : {}),
      ...(args.select.password ? { password: found.password } : {}),
      ...(args.select.createdAt ? { createdAt: found.createdAt } : {})
    };
  });

  prismaMock.reading.findMany.mockImplementation(
    async (args: { where: { userId: string }; orderBy: { createdAt: "desc" } }) => {
      return readings
        .filter((reading) => reading.userId === args.where.userId)
        .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
    }
  );

  prismaMock.reading.create.mockImplementation(
    async (args: {
      data: {
        userId: string;
        firstName: string;
        lastName: string;
        birthDate: Date;
        category: StoredReading["category"];
        results: Record<string, unknown>;
      };
    }) => {
      const now = new Date();
      const reading: StoredReading = {
        id: `reading_${readings.length + 1}`,
        userId: args.data.userId,
        firstName: args.data.firstName,
        lastName: args.data.lastName,
        birthDate: new Date(args.data.birthDate),
        category: args.data.category,
        results: args.data.results,
        createdAt: now
      };

      readings.push(reading);
      return reading;
    }
  );

  prismaMock.reading.findFirst.mockImplementation(
    async (args: { where: { id: string; userId: string } }) => {
      return (
        readings.find(
          (reading) =>
            reading.id === args.where.id && reading.userId === args.where.userId
        ) ?? null
      );
    }
  );

  prismaMock.reading.deleteMany.mockImplementation(
    async (args: { where: { id: string; userId: string } }) => {
      const beforeCount = readings.length;
      readings = readings.filter(
        (reading) =>
          !(reading.id === args.where.id && reading.userId === args.where.userId)
      );

      return { count: beforeCount - readings.length };
    }
  );
});

async function registerAndLogin(email: string) {
  const password = "StrongPass123";

  const registerResponse = await request(app).post("/api/auth/register").send({
    email,
    password
  });
  expect(registerResponse.status).toBe(201);

  const loginResponse = await request(app).post("/api/auth/login").send({
    email,
    password
  });
  expect(loginResponse.status).toBe(200);

  return {
    userId: registerResponse.body.user.id as string,
    token: loginResponse.body.token as string
  };
}

describe("readings integration", () => {
  it("creates, lists, gets, and deletes own readings", async () => {
    const session = await registerAndLogin("reader@numora.dev");

    const createResponse = await request(app)
      .post("/api/readings")
      .set("Authorization", `Bearer ${session.token}`)
      .send({
        firstName: "Marie",
        lastName: "Dupont",
        birthDate: "1990-03-15",
        category: "life-path",
        results: { lifePath: 1, expression: 7 }
      });

    expect(createResponse.status).toBe(201);
    expect(createResponse.body.reading.userId).toBe(session.userId);
    expect(createResponse.body.reading.category).toBe("life-path");

    const readingId = createResponse.body.reading.id as string;

    const listResponse = await request(app)
      .get("/api/readings")
      .set("Authorization", `Bearer ${session.token}`);

    expect(listResponse.status).toBe(200);
    expect(listResponse.body.readings).toHaveLength(1);
    expect(listResponse.body.readings[0].id).toBe(readingId);

    const getResponse = await request(app)
      .get(`/api/readings/${readingId}`)
      .set("Authorization", `Bearer ${session.token}`);

    expect(getResponse.status).toBe(200);
    expect(getResponse.body.reading.firstName).toBe("Marie");

    const deleteResponse = await request(app)
      .delete(`/api/readings/${readingId}`)
      .set("Authorization", `Bearer ${session.token}`);

    expect(deleteResponse.status).toBe(204);

    const afterDeleteListResponse = await request(app)
      .get("/api/readings")
      .set("Authorization", `Bearer ${session.token}`);

    expect(afterDeleteListResponse.status).toBe(200);
    expect(afterDeleteListResponse.body.readings).toHaveLength(0);
  });

  it("rejects invalid reading payload", async () => {
    const session = await registerAndLogin("invalid@numora.dev");

    const response = await request(app)
      .post("/api/readings")
      .set("Authorization", `Bearer ${session.token}`)
      .send({
        firstName: "Marie",
        birthDate: "invalid-date",
        category: "unknown",
        results: []
      });

    expect(response.status).toBe(400);
    expect(typeof response.body.error).toBe("string");
  });

  it("prevents reading access across different users", async () => {
    const ownerSession = await registerAndLogin("owner@numora.dev");
    const otherSession = await registerAndLogin("other@numora.dev");

    const createResponse = await request(app)
      .post("/api/readings")
      .set("Authorization", `Bearer ${ownerSession.token}`)
      .send({
        firstName: "Alice",
        lastName: "Martin",
        birthDate: "1988-07-21",
        category: "forecast",
        results: { month: 4 }
      });

    expect(createResponse.status).toBe(201);
    const readingId = createResponse.body.reading.id as string;

    const getAsOtherUserResponse = await request(app)
      .get(`/api/readings/${readingId}`)
      .set("Authorization", `Bearer ${otherSession.token}`);

    expect(getAsOtherUserResponse.status).toBe(404);

    const deleteAsOtherUserResponse = await request(app)
      .delete(`/api/readings/${readingId}`)
      .set("Authorization", `Bearer ${otherSession.token}`);

    expect(deleteAsOtherUserResponse.status).toBe(404);
  });
});
