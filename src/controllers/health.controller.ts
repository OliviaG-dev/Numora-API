import { Request, Response } from "express";

import { getPingPayload } from "../services/health.service";

export function ping(_req: Request, res: Response): void {
  res.json(getPingPayload());
}
