import rateLimit from "express-rate-limit";

const authWindowMs = Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS ?? 15 * 60 * 1000);
const authMaxAttempts = Number(process.env.AUTH_RATE_LIMIT_MAX ?? 10);

export const authRateLimiter = rateLimit({
  windowMs: authWindowMs,
  limit: authMaxAttempts,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    error: "Too many authentication attempts, please retry later"
  }
});
