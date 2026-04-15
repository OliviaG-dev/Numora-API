import { Prisma } from "@prisma/client";

import {
  READING_CATEGORIES,
  type Reading,
  type ReadingCategory
} from "../models/reading.model";
import { prisma } from "../utils/prisma";

type CreateReadingInput = {
  firstName: string;
  lastName: string;
  birthDate: Date;
  category: ReadingCategory;
  results: Record<string, unknown>;
};

export class ReadingValidationError extends Error {}

function isObjectRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function parseBirthDate(value: unknown): Date | null {
  if (typeof value !== "string") {
    return null;
  }

  const parsedDate = new Date(value);

  if (Number.isNaN(parsedDate.getTime())) {
    return null;
  }

  return parsedDate;
}

function isReadingCategory(value: unknown): value is ReadingCategory {
  return typeof value === "string" && READING_CATEGORIES.includes(value as ReadingCategory);
}

export function parseCreateReadingInput(payload: unknown): CreateReadingInput {
  if (!isObjectRecord(payload)) {
    throw new ReadingValidationError("request body must be an object");
  }

  const { firstName, lastName, birthDate, category, results } = payload;

  if (
    typeof firstName !== "string" ||
    typeof lastName !== "string" ||
    !firstName.trim() ||
    !lastName.trim()
  ) {
    throw new ReadingValidationError("firstName and lastName are required");
  }

  const parsedBirthDate = parseBirthDate(birthDate);
  if (!parsedBirthDate) {
    throw new ReadingValidationError("birthDate must be a valid date string");
  }

  if (!isReadingCategory(category)) {
    throw new ReadingValidationError(
      `category must be one of: ${READING_CATEGORIES.join(", ")}`
    );
  }

  if (!isObjectRecord(results)) {
    throw new ReadingValidationError("results must be an object");
  }

  return {
    firstName: firstName.trim(),
    lastName: lastName.trim(),
    birthDate: parsedBirthDate,
    category,
    results
  };
}

function toReading(reading: {
  id: string;
  userId: string;
  firstName: string;
  lastName: string;
  birthDate: Date;
  category: string;
  results: Prisma.JsonValue;
  createdAt: Date;
}): Reading {
  return {
    id: reading.id,
    userId: reading.userId,
    firstName: reading.firstName,
    lastName: reading.lastName,
    birthDate: reading.birthDate.toISOString(),
    category: reading.category as ReadingCategory,
    results: reading.results as Record<string, unknown>,
    createdAt: reading.createdAt.toISOString()
  };
}

export async function listReadingsByUser(userId: string): Promise<Reading[]> {
  const readings = await prisma.reading.findMany({
    where: { userId },
    orderBy: { createdAt: "desc" }
  });

  return readings.map(toReading);
}

export async function createReadingForUser(
  userId: string,
  input: CreateReadingInput
): Promise<Reading> {
  const reading = await prisma.reading.create({
    data: {
      userId,
      firstName: input.firstName,
      lastName: input.lastName,
      birthDate: input.birthDate,
      category: input.category,
      results: input.results as Prisma.InputJsonValue
    }
  });

  return toReading(reading);
}

export async function getReadingByIdForUser(
  userId: string,
  readingId: string
): Promise<Reading | null> {
  const reading = await prisma.reading.findFirst({
    where: {
      id: readingId,
      userId
    }
  });

  if (!reading) {
    return null;
  }

  return toReading(reading);
}

export async function deleteReadingByIdForUser(
  userId: string,
  readingId: string
): Promise<boolean> {
  const deleted = await prisma.reading.deleteMany({
    where: {
      id: readingId,
      userId
    }
  });

  return deleted.count > 0;
}
