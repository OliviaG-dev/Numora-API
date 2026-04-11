import { Response } from "express";

export function notImplemented(res: Response, feature: string): void {
  res.status(501).json({
    error: `${feature} is not implemented yet`
  });
}
