import { Request, Response } from "express";

import {
  createReadingForUser,
  deleteReadingByIdForUser,
  getReadingByIdForUser,
  listReadingsByUser,
  parseCreateReadingInput,
  ReadingValidationError
} from "../services/readings.service";

function getUserId(res: Response): string | null {
  const userId = res.locals.auth?.userId;
  if (!userId) {
    return null;
  }

  return userId;
}

function getReadingId(req: Request): string | null {
  const readingId = req.params.id;
  if (typeof readingId !== "string" || !readingId.trim()) {
    return null;
  }

  return readingId;
}

export async function getReadings(_req: Request, res: Response): Promise<void> {
  const userId = getUserId(res);
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const readings = await listReadingsByUser(userId);
    res.json({ readings });
  } catch {
    res.status(500).json({ error: "failed to fetch readings" });
  }
}

export async function createReading(req: Request, res: Response): Promise<void> {
  const userId = getUserId(res);
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }

  try {
    const input = parseCreateReadingInput(req.body);
    const reading = await createReadingForUser(userId, input);
    res.status(201).json({ reading });
  } catch (error) {
    if (error instanceof ReadingValidationError) {
      res.status(400).json({ error: error.message });
      return;
    }

    res.status(500).json({ error: "failed to create reading" });
  }
}

export async function getReadingById(req: Request, res: Response): Promise<void> {
  const userId = getUserId(res);
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const readingId = getReadingId(req);
  if (!readingId) {
    res.status(400).json({ error: "invalid reading id" });
    return;
  }

  try {
    const reading = await getReadingByIdForUser(userId, readingId);
    if (!reading) {
      res.status(404).json({ error: "reading not found" });
      return;
    }

    res.json({ reading });
  } catch {
    res.status(500).json({ error: "failed to fetch reading" });
  }
}

export async function deleteReading(req: Request, res: Response): Promise<void> {
  const userId = getUserId(res);
  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
  }
  const readingId = getReadingId(req);
  if (!readingId) {
    res.status(400).json({ error: "invalid reading id" });
    return;
  }

  try {
    const deleted = await deleteReadingByIdForUser(userId, readingId);
    if (!deleted) {
      res.status(404).json({ error: "reading not found" });
      return;
    }

    res.status(204).send();
  } catch {
    res.status(500).json({ error: "failed to delete reading" });
  }
}
