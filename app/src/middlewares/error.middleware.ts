import { Request, Response, NextFunction } from "express";
import { ResponseBuilder } from "../utils/responseBuilder";

export const errorHandler = (
  err: any,
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  const status = err.status || 500;
  const message = err.message || "Internal Server Error";

  return res.status(status).json(ResponseBuilder.error(message));
};