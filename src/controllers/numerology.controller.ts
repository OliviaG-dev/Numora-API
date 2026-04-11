import { Request, Response } from "express";

import { notImplemented } from "../utils/http";

export function calculateNumerology(_req: Request, res: Response): void {
  notImplemented(res, "POST /numerology/calculate");
}
