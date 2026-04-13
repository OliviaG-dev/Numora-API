import jwt, { JwtPayload, SignOptions } from "jsonwebtoken";

const MIN_JWT_SECRET_LENGTH = 32;
const DEFAULT_ACCESS_TOKEN_TTL = "7d";

type AccessTokenPayload = {
  sub: string;
  email: string;
};

export type DecodedAccessToken = JwtPayload & {
  sub?: string;
  email?: string;
};

export function normalizeEmail(value: string): string {
  return value.trim().toLowerCase();
}

export function isValidEmail(value: string): boolean {
  const normalized = normalizeEmail(value);
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailPattern.test(normalized);
}

export function getPasswordValidationError(value: string): string | null {
  if (value.length < 10) {
    return "password must be at least 10 characters";
  }

  if (!/[A-Z]/.test(value)) {
    return "password must include at least one uppercase letter";
  }

  if (!/[a-z]/.test(value)) {
    return "password must include at least one lowercase letter";
  }

  if (!/[0-9]/.test(value)) {
    return "password must include at least one number";
  }

  return null;
}

export function getJwtSecretOrThrow(): string {
  const jwtSecret = process.env.JWT_SECRET;

  if (!jwtSecret) {
    throw new Error("JWT_SECRET is not configured");
  }

  if (jwtSecret.length < MIN_JWT_SECRET_LENGTH) {
    throw new Error(`JWT_SECRET must be at least ${MIN_JWT_SECRET_LENGTH} characters`);
  }

  return jwtSecret;
}

export function signAccessToken(payload: AccessTokenPayload): string {
  const secret = getJwtSecretOrThrow();
  const configuredTtl = process.env.JWT_EXPIRES_IN;
  const options: SignOptions = {
    expiresIn: configuredTtl
      ? (configuredTtl as SignOptions["expiresIn"])
      : DEFAULT_ACCESS_TOKEN_TTL
  };
  return jwt.sign(payload, secret, options);
}

export function verifyAccessToken(token: string): DecodedAccessToken {
  const secret = getJwtSecretOrThrow();
  return jwt.verify(token, secret) as DecodedAccessToken;
}
