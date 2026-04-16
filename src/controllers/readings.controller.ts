import { Request, Response } from "express";

import {
  createReadingForUser,
  deleteReadingByIdForUser,
  getReadingByIdForUser,
  listReadingsByUser,
  parseCreateReadingInput,
  ReadingValidationError
} from "../services/readings.service";
import { HttpError, asyncHandler } from "../utils/http";

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

export const getReadings = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const userId = getUserId(res);
  if (!userId) {
    throw new HttpError(401, "Unauthorized");
  }

  const readings = await listReadingsByUser(userId);
  res.json({ readings });
});

export const createReading = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = getUserId(res);
  if (!userId) {
    throw new HttpError(401, "Unauthorized");
  }

  try {
    const input = parseCreateReadingInput(req.body);
    const reading = await createReadingForUser(userId, input);
    res.status(201).json({ reading });
  } catch (error) {
    if (error instanceof ReadingValidationError) {
      throw new HttpError(400, error.message);
    }
    throw error;
  }
});

export const getReadingById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
  const userId = getUserId(res);
  if (!userId) {
    throw new HttpError(401, "Unauthorized");
  }
  const readingId = getReadingId(req);
  if (!readingId) {
    throw new HttpError(400, "invalid reading id");
  }

  const reading = await getReadingByIdForUser(userId, readingId);
  if (!reading) {
    throw new HttpError(404, "reading not found");
  }

  res.json({ reading });
});

export const deleteReading = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const userId = getUserId(res);
  if (!userId) {
    throw new HttpError(401, "Unauthorized");
  }
  const readingId = getReadingId(req);
  if (!readingId) {
    throw new HttpError(400, "invalid reading id");
  }

  const deleted = await deleteReadingByIdForUser(userId, readingId);
  if (!deleted) {
    throw new HttpError(404, "reading not found");
  }

  res.status(204).send();
});
