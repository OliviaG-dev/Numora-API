import { Prisma } from "@prisma/client";
import bcrypt from "bcryptjs";
import { Request, Response } from "express";

import { prisma } from "../utils/prisma";
import {
  getPasswordValidationError,
  isValidEmail,
  normalizeEmail,
  signAccessToken
} from "../utils/auth";

type RegisterBody = {
  email?: string;
  password?: string;
};

type Credentials = {
  email: string;
  password: string;
};

function parseCredentials(req: Request, res: Response): Credentials | null {
  const { email, password } = req.body as RegisterBody;

  if (!email || !password) {
    res.status(400).json({ error: "email and password are required" });
    return null;
  }

  if (typeof email !== "string" || typeof password !== "string") {
    res.status(400).json({ error: "email and password must be strings" });
    return null;
  }

  return {
    email: normalizeEmail(email),
    password
  };
}

export async function register(req: Request, res: Response): Promise<void> {
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
      res.status(409).json({ error: "email already in use" });
      return;
    }

    res.status(500).json({ error: "failed to create user" });
  }
}

export async function login(req: Request, res: Response): Promise<void> {
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
      res.status(401).json({ error: "invalid credentials" });
      return;
    }

    const isValidPassword = await bcrypt.compare(credentials.password, user.password);

    if (!isValidPassword) {
      res.status(401).json({ error: "invalid credentials" });
      return;
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
  } catch {
    res.status(500).json({ error: "failed to login" });
  }
}

export async function me(_req: Request, res: Response): Promise<void> {
  const userId = res.locals.auth?.userId;

  if (!userId) {
    res.status(401).json({ error: "Unauthorized" });
    return;
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
      res.status(404).json({ error: "user not found" });
      return;
    }

    res.json({
      user: {
        ...user,
        createdAt: user.createdAt.toISOString()
      }
    });
  } catch {
    res.status(500).json({ error: "failed to fetch current user" });
  }
}
