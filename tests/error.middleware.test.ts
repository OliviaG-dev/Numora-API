import type { NextFunction, Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";
import { ZodError } from "zod";

import { errorHandler, notFoundHandler } from "../src/middleware/error.middleware";
import { HttpError } from "../src/utils/http";

function mockResponse(): Response {
  const res = {
    status: vi.fn().mockReturnThis(),
    json: vi.fn().mockReturnThis()
  };
  return res as unknown as Response;
}

describe("notFoundHandler", () => {
  it("returns 404 JSON payload", () => {
    const res = mockResponse();
    notFoundHandler({} as Request, res);
    expect(res.status).toHaveBeenCalledWith(404);
    expect(res.json).toHaveBeenCalledWith({ error: "Route not found" });
  });
});

describe("errorHandler", () => {
  it("maps HttpError to status and optional details", () => {
    const res = mockResponse();
    const next = vi.fn() as NextFunction;

    errorHandler(
      new HttpError(422, "invalid", { field: "x" }),
      {} as Request,
      res,
      next
    );

    expect(res.status).toHaveBeenCalledWith(422);
    expect(res.json).toHaveBeenCalledWith({
      error: "invalid",
      details: { field: "x" }
    });
  });

  it("maps ZodError to 400 with flattened details", () => {
    const res = mockResponse();
    const next = vi.fn() as NextFunction;
    const zodError = new ZodError([
      {
        code: "custom",
        message: "bad",
        path: ["birthDate"]
      }
    ]);

    errorHandler(zodError, {} as Request, res, next);

    expect(res.status).toHaveBeenCalledWith(400);
    expect(res.json).toHaveBeenCalledWith({
      error: "Validation error",
      details: zodError.flatten()
    });
  });

  it("maps unknown errors to 500 and logs", () => {
    const res = mockResponse();
    const next = vi.fn() as NextFunction;
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});

    errorHandler(new Error("boom"), {} as Request, res, next);

    expect(spy).toHaveBeenCalled();
    expect(res.status).toHaveBeenCalledWith(500);
    expect(res.json).toHaveBeenCalledWith({ error: "Internal server error" });

    spy.mockRestore();
  });
});
