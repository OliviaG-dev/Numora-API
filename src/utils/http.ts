import { NextFunction, Request, Response } from "express";

export function notImplemented(res: Response, feature: string): void {
  res.status(501).json({
    error: `${feature} is not implemented yet`
  });
}

export class HttpError extends Error {
  statusCode: number;
  details?: unknown;

  constructor(statusCode: number, message: string, details?: unknown) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
  }
}

export type AsyncRequestHandler = (
  req: Request,
  res: Response,
  next: NextFunction
) => Promise<void> | void;

export function asyncHandler(handler: AsyncRequestHandler): AsyncRequestHandler {
  return async (req, res, next) => {
    try {
      await handler(req, res, next);
    } catch (error) {
      next(error);
    }
  };
}
