import { Request, Response, NextFunction } from "express";
import { getBalanceValue } from "../services/balance.service";
import { ResponseBuilder } from "../utils/responseBuilder";
import { Balance } from "../types/balance.types";

export const getBalance = (
  _req: Request,
  res: Response,
  _next: NextFunction
): Response => {
  const result: Balance = getBalanceValue();
  return res.status(200).json(ResponseBuilder.success(result));
};