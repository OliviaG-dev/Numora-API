import { Router } from "express";

import { login, me, register } from "../controllers/auth.controller";
import { requireAuth } from "../middleware/auth.middleware";
import { authRateLimiter } from "../middleware/rate-limit.middleware";

export const authRouter = Router();

authRouter.post("/auth/register", authRateLimiter, register);
authRouter.post("/auth/login", authRateLimiter, login);
authRouter.get("/auth/me", requireAuth, me);
