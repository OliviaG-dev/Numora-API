import rateLimit from "express-rate-limit";

const authWindowMs = Number(process.env.AUTH_RATE_LIMIT_WINDOW_MS ?? 15 * 60 * 1000);
const authMaxAttempts = Number(process.env.AUTH_RATE_LIMIT_MAX ?? 10);
const globalWindowMs = Number(process.env.API_RATE_LIMIT_WINDOW_MS ?? 15 * 60 * 1000);
const globalMaxRequests = Number(process.env.API_RATE_LIMIT_MAX ?? 300);
const numerologyWindowMs = Number(
  process.env.NUMEROLOGY_RATE_LIMIT_WINDOW_MS ?? 15 * 60 * 1000
);
const numerologyMaxRequests = Number(process.env.NUMEROLOGY_RATE_LIMIT_MAX ?? 60);

export const globalRateLimiter = rateLimit({
  windowMs: globalWindowMs,
  limit: globalMaxRequests,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    error: "Too many requests, please retry later"
  }
});

export const authRateLimiter = rateLimit({
  windowMs: authWindowMs,
  limit: authMaxAttempts,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    error: "Too many authentication attempts, please retry later"
  }
});

export const numerologyRateLimiter = rateLimit({
  windowMs: numerologyWindowMs,
  limit: numerologyMaxRequests,
  standardHeaders: "draft-7",
  legacyHeaders: false,
  message: {
    error: "Too many numerology requests, please retry later"
  }
});
