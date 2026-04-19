import type { NextFunction, Request, Response } from "express";
import { beforeEach, describe, expect, it, vi } from "vitest";

import { requireAuth } from "../src/middleware/auth.middleware";

vi.mock("../src/utils/auth", () => ({
  verifyAccessToken: vi.fn()
}));

import { verifyAccessToken } from "../src/utils/auth";

function mockResponse(): Response {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis(),
    locals: {} as Record<string, unknown>
  };
  return res as unknown as Response;
}

describe("requireAuth", () => {
  beforeEach(() => {
    vi.mocked(verifyAccessToken).mockReset();
  });

  it("returns 401 when Authorization header is missing", () => {
    const req = { headers: {} } as Request;
    const res = mockResponse();
    const next = vi.fn() as NextFunction;

    requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Missing or invalid Bearer token" });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 when scheme is not Bearer", () => {
    const req = { headers: { authorization: "Basic xyz" } } as unknown as Request;
    const res = mockResponse();
    const next = vi.fn() as NextFunction;

    requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 when Bearer token is empty", () => {
    const req = { headers: { authorization: "Bearer   " } } as unknown as Request;
    const res = mockResponse();
    const next = vi.fn() as NextFunction;

    requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 when verifyAccessToken throws", () => {
    vi.mocked(verifyAccessToken).mockImplementation(() => {
      throw new Error("invalid signature");
    });

    const req = { headers: { authorization: "Bearer badtoken" } } as unknown as Request;
    const res = mockResponse();
    const next = vi.fn() as NextFunction;

    requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid or expired token" });
    expect(next).not.toHaveBeenCalled();
  });

  it("returns 401 when token payload has no sub", () => {
    vi.mocked(verifyAccessToken).mockReturnValue({ email: "a@b.com" } as ReturnType<
      typeof verifyAccessToken
    >);

    const req = { headers: { authorization: "Bearer sometoken" } } as unknown as Request;
    const res = mockResponse();
    const next = vi.fn() as NextFunction;

    requireAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ error: "Invalid token payload" });
    expect(next).not.toHaveBeenCalled();
  });

  it("calls next and sets res.locals.auth when token is valid", () => {
    vi.mocked(verifyAccessToken).mockReturnValue({
      sub: "user-1",
      email: "user@example.com"
    } as ReturnType<typeof verifyAccessToken>);

    const req = { headers: { authorization: "Bearer valid" } } as unknown as Request;
    const res = mockResponse();
    const next = vi.fn() as NextFunction;

    requireAuth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.locals.auth).toEqual({ userId: "user-1", email: "user@example.com" });
  });

  it("omits email in locals when payload email is not a string", () => {
    vi.mocked(verifyAccessToken).mockReturnValue({
      sub: "user-2",
      email: 123
    } as unknown as ReturnType<typeof verifyAccessToken>);

    const req = { headers: { authorization: "Bearer valid" } } as unknown as Request;
    const res = mockResponse();
    const next = vi.fn() as NextFunction;

    requireAuth(req, res, next);

    expect(next).toHaveBeenCalled();
    expect(res.locals.auth).toEqual({ userId: "user-2", email: undefined });
  });
});
