import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";

import { HttpError, asyncHandler } from "../utils/http";
import { prisma } from "../utils/prisma";
import {
  getPasswordValidationError,
  isValidEmail,
  normalizeEmail,
  signAccessToken
} from "../utils/auth";
import { authCredentialsSchema } from "../validation/request-schemas";

type Credentials = {
  email: string;
  password: string;
};

function parseCredentials(req: Request, res: Response): Credentials | null {
  const parsed = authCredentialsSchema.safeParse(req.body);
  if (!parsed.success) {
    const firstIssue = parsed.error.issues[0];
    const field = firstIssue?.path?.[0];
    const message = field
      ? `${String(field)}: ${firstIssue.message}`
      : "Validation error";
    res.status(400).json({
      error: message,
      details: parsed.error.flatten()
    });
    return null;
  }
  const { email, password } = parsed.data;
  return {
    email: normalizeEmail(email),
    password
  };
}

export const register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const credentials = parseCredentials(req, res);
  if (!credentials) {
    return;
  }

  if (!isValidEmail(credentials.email)) {
    res.status(400).json({ error: "email format is invalid" });
    return;
  }

  const passwordError = getPasswordValidationError(credentials.password);
  if (passwordError) {
    res.status(400).json({ error: passwordError });
    return;
  }

  try {
    const hashedPassword = await bcrypt.hash(credentials.password, 12);
    const user = await prisma.user.create({
      data: {
        email: credentials.email,
        password: hashedPassword
      },
      select: {
        id: true,
        email: true,
        createdAt: true
      }
    });

    res.status(201).json({
      user: {
        ...user,
        createdAt: user.createdAt.toISOString()
      }
    });
  } catch (error) {
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === "P2002") {
      throw new HttpError(409, "email already in use");
    }
    throw error;
  }
});

export const login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
  const credentials = parseCredentials(req, res);
  if (!credentials) {
    return;
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: credentials.email },
      select: {
        id: true,
        email: true,
        password: true,
        createdAt: true
      }
    });

    if (!user) {
      throw new HttpError(401, "invalid credentials");
    }

    const isValidPassword = await bcrypt.compare(credentials.password, user.password);

    if (!isValidPassword) {
      throw new HttpError(401, "invalid credentials");
    }

    const token = signAccessToken({ sub: user.id, email: user.email });

    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        createdAt: user.createdAt.toISOString()
      }
    });
  } catch (error) {
    throw error;
  }
});

export const me = asyncHandler(async (_req: Request, res: Response): Promise<void> => {
  const userId = res.locals.auth?.userId;

  if (!userId) {
    throw new HttpError(401, "Unauthorized");
  }

  try {
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        createdAt: true
      }
    });

    if (!user) {
      throw new HttpError(404, "user not found");
    }

    res.json({
      user: {
        ...user,
        createdAt: user.createdAt.toISOString()
      }
    });
  } catch (error) {
    throw error;
  }
});
