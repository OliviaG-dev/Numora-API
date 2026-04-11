import { Request, Response } from "express";

import { notImplemented } from "../utils/http";

export function getReadings(_req: Request, res: Response): void {
  notImplemented(res, "GET /readings");
}

export function createReading(_req: Request, res: Response): void {
  notImplemented(res, "POST /readings");
}

export function getReadingById(_req: Request, res: Response): void {
  notImplemented(res, "GET /readings/:id");
}

export function deleteReading(_req: Request, res: Response): void {
  notImplemented(res, "DELETE /readings/:id");
}
