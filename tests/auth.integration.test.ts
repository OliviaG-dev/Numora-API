import { Prisma } from "@prisma/client";
import request from "supertest";
import { beforeAll, beforeEach, describe, expect, it, vi } from "vitest";

type StoredUser = {
  id: string;
  email: string;
  password: string;
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
  }
};

vi.mock("../src/utils/prisma", () => ({
  prisma: prismaMock
}));

let app: typeof import("../src/app").app;
let users: StoredUser[] = [];

beforeAll(async () => {
  process.env.JWT_SECRET = "test_jwt_secret_with_more_than_32_characters";
  process.env.JWT_EXPIRES_IN = "7d";
  process.env.AUTH_RATE_LIMIT_MAX = "1000";
  process.env.AUTH_RATE_LIMIT_WINDOW_MS = "60000";

  ({ app } = await import("../src/app"));
});

beforeEach(() => {
  users = [];
  vi.clearAllMocks();

  prismaMock.user.create.mockImplementation(async (args: UserQuery & { data: { email: string; password: string } }) => {
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
  });

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
});

describe("auth integration", () => {
  it("registers, logs in, and fetches current user", async () => {
    const registerResponse = await request(app).post("/api/auth/register").send({
      email: "Test@Numora.dev",
      password: "StrongPass123"
    });

    expect(registerResponse.status).toBe(201);
    expect(registerResponse.body.user.email).toBe("test@numora.dev");

    const loginResponse = await request(app).post("/api/auth/login").send({
      email: "test@numora.dev",
      password: "StrongPass123"
    });

    expect(loginResponse.status).toBe(200);
    expect(typeof loginResponse.body.token).toBe("string");

    const meResponse = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${loginResponse.body.token}`);

    expect(meResponse.status).toBe(200);
    expect(meResponse.body.user.id).toBe(registerResponse.body.user.id);
    expect(meResponse.body.user.email).toBe("test@numora.dev");
  });

  it("rejects weak password at register", async () => {
    const response = await request(app).post("/api/auth/register").send({
      email: "test@numora.dev",
      password: "weakpass"
    });

    expect(response.status).toBe(400);
    expect(response.body.error).toContain("password");
  });

  it("rejects invalid credentials on login", async () => {
    await request(app).post("/api/auth/register").send({
      email: "test@numora.dev",
      password: "StrongPass123"
    });

    const response = await request(app).post("/api/auth/login").send({
      email: "test@numora.dev",
      password: "WrongPass123"
    });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("invalid credentials");
  });

  it("rejects /me without bearer token", async () => {
    const response = await request(app).get("/api/auth/me");

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("Missing or invalid Bearer token");
  });

  it("returns 409 when email is already registered (unique constraint)", async () => {
    const duplicateError = new Prisma.PrismaClientKnownRequestError("duplicate", {
      code: "P2002",
      clientVersion: "test",
      meta: { target: ["email"] }
    });
    prismaMock.user.create.mockRejectedValueOnce(duplicateError);

    const response = await request(app).post("/api/auth/register").send({
      email: "taken@numora.dev",
      password: "StrongPass123"
    });

    expect(response.status).toBe(409);
    expect(response.body.error).toBe("email already in use");
  });

  it("returns 404 on /me when user record is gone", async () => {
    const registerResponse = await request(app).post("/api/auth/register").send({
      email: "ghost@numora.dev",
      password: "StrongPass123"
    });
    expect(registerResponse.status).toBe(201);

    const loginResponse = await request(app).post("/api/auth/login").send({
      email: "ghost@numora.dev",
      password: "StrongPass123"
    });
    expect(loginResponse.status).toBe(200);

    prismaMock.user.findUnique.mockResolvedValueOnce(null);

    const meResponse = await request(app)
      .get("/api/auth/me")
      .set("Authorization", `Bearer ${loginResponse.body.token}`);

    expect(meResponse.status).toBe(404);
    expect(meResponse.body.error).toBe("user not found");
  });

  it("rejects register body that fails schema validation", async () => {
    const response = await request(app).post("/api/auth/register").send({
      email: "not-an-email",
      password: "x"
    });

    expect(response.status).toBe(400);
    expect(response.body.details).toBeDefined();
  });

  it("rejects login for unknown user", async () => {
    const response = await request(app).post("/api/auth/login").send({
      email: "nobody@numora.dev",
      password: "StrongPass123"
    });

    expect(response.status).toBe(401);
    expect(response.body.error).toBe("invalid credentials");
  });
});
