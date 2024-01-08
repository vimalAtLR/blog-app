import { NextFunction, Request, Response } from 'express';
import logger from '../common/logger';

export function methodCallLogger(request: Request, _response: Response, next: NextFunction) {
  logger.info(`Requesting ${request.method} ${request.originalUrl}`, { body: request.body, headers: request.headers });
  return next();
}

export function errorHandler(error: Error, request: Request, _response: Response, next: NextFunction) {
  logger.error(`Requesting ${request.method} ${request.originalUrl}`, {
    error: error.message,
    headers: request.headers,
  });
  return next();
}
