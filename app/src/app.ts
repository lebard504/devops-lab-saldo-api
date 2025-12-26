import express from "express";
import balanceRoutes from "./routes/balance.routes";
import { errorHandler } from "./middlewares/error.middleware";
import { NotFoundError } from "./errors/NotFoundError";

const app = express();

app.use(express.json());

app.use("/balance", balanceRoutes);

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.use((_req, _res, next) => {
  next(new NotFoundError("Route not found"));
});

app.use(errorHandler);

export default app;