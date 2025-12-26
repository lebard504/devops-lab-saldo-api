import { Balance } from "../types/balance.types";

export const getBalanceValue = (): Balance => {
  return {
    balance: 123.45,
    currency: "USD"
  };
};