import express from "express";
import type { Express } from "express";
import { authRouter } from "./auth/routes";

export function createApplication(): Express {
  const app = express();
  //middlewares
  app.use(express.json());

  //routes
  app.get("/", (req, res) => {
    return res.json({
      message: "welcome to chaicode auth service",
    });
  });
  app.use("/auth", authRouter);

  return app;
}
