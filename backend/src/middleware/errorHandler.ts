import { Request, Response, NextFunction } from 'express';

export interface ApiError extends Error {
  statusCode?: number;
}

export function errorHandler(err: ApiError, req: Request, res: Response, next: NextFunction) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal server error';

  console.error(`[${new Date().toISOString()}] Error:`, {
    statusCode,
    message,
    stack: err.stack,
  });

  res.status(statusCode).json({
    success: false,
    error: message,
  });
}
