import type { NextFunction, Request, Response } from "express";
import { describe, expect, it, vi } from "vitest";

import { HttpError, asyncHandler, notImplemented } from "../src/utils/http";

describe("notImplemented", () => {
  it("returns 501 with feature name", () => {
    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as unknown as Response;

    notImplemented(res, "export");

    expect(res.status).toHaveBeenCalledWith(501);
    expect(res.json).toHaveBeenCalledWith({
      error: "export is not implemented yet"
    });
  });
});

describe("asyncHandler", () => {
  it("forwards thrown errors to next", async () => {
    const handler = asyncHandler(async () => {
      throw new HttpError(400, "bad request");
    });

    const next = vi.fn() as NextFunction;
    await handler({} as Request, {} as Response, next);

    expect(next).toHaveBeenCalledTimes(1);
    expect(next.mock.calls[0][0]).toBeInstanceOf(HttpError);
  });

  it("does not call next when handler completes", async () => {
    const handler = asyncHandler(async (_req, res) => {
      (res as Response & { sent?: boolean }).status(200).json({ ok: true });
    });

    const res = {
      status: vi.fn().mockReturnThis(),
      json: vi.fn()
    } as unknown as Response;
    const next = vi.fn() as NextFunction;

    await handler({} as Request, res, next);

    expect(next).not.toHaveBeenCalled();
  });
});
