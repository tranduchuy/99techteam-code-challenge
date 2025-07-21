import { Request, Response, NextFunction } from 'express';

interface ErrorWithStatus {
  status?: number;
  message?: string;
}

export function errorHandler(
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) {
  if (res.headersSent) {
    return next(err);
  }
  let status = 500;
  let message = 'Internal Server Error';
  if (typeof err === 'object' && err !== null && 'message' in err) {
    const errorObj = err as ErrorWithStatus;
    status = errorObj.status || 500;
    message = errorObj.message || 'Internal Server Error';
  }
  res.status(status).json({ error: message });
}
