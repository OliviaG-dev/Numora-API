import { NextFunction, Request, Response } from "express";
import { verifyAccessToken } from "../utils/auth";

export function requireAuth(req: Request, res: Response, next: NextFunction): void {
  const authorization = req.headers.authorization;

  if (!authorization || !authorization.startsWith("Bearer ")) {
    res.status(401).json({ error: "Missing or invalid Bearer token" });
    return;
  }

  const token = authorization.slice("Bearer ".length).trim();

  if (!token) {
    res.status(401).json({ error: "Missing or invalid Bearer token" });
    return;
  }

  try {
    const payload = verifyAccessToken(token);

    if (!payload.sub || typeof payload.sub !== "string") {
      res.status(401).json({ error: "Invalid token payload" });
      return;
    }

    res.locals.auth = {
      userId: payload.sub,
      email: typeof payload.email === "string" ? payload.email : undefined
    };
  } catch {
    res.status(401).json({ error: "Invalid or expired token" });
    return;
  }

  next();
}
