import { Request, Response } from "express";

import { notImplemented } from "../utils/http";

export function register(_req: Request, res: Response): void {
  notImplemented(res, "POST /auth/register");
}

export function login(_req: Request, res: Response): void {
  notImplemented(res, "POST /auth/login");
}

export function me(_req: Request, res: Response): void {
  notImplemented(res, "GET /auth/me");
}
