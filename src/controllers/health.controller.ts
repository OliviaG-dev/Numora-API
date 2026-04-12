import { Request, Response } from "express";

import { getPingPayload } from "../services/health.service";

export async function ping(_req: Request, res: Response): Promise<void> {
  const payload = await getPingPayload();
  res.json(payload);
}
