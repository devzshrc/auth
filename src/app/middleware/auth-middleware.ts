import type { Request, Response, NextFunction } from "express";
import { verifyUserToken } from "../auth/utils/token";

export function authenticationMiddleware() {
  return function (req: Request, res: Response, next: NextFunction) {
    const header = req.headers["authorization"];

    // no auth header → skip (public route)
    if (!header) return next();

    // must start with Bearer
    if (!header.startsWith("Bearer ")) {
      return res.status(400).json({
        error: "authorization header must start with Bearer",
      });
    }

    const token = header.split(" ")[1];

    // token missing
    if (!token) {
      return res.status(400).json({
        error: "token missing in authorization header",
      });
    }

    try {
      const user = verifyUserToken(token);

      //@ts-ignore
      req.user = user;

      return next();
    } catch (err) {
      return res.status(401).json({
        error: "invalid or expired token",
      });
    }
  };
}

export function restrictToAuthenticatedUser() {
  return function (req: Request, res: Response, next: NextFunction) {
    //@ts-ignore
    if (!req.user)
      return res.status(401).json({
        error: "Authentication Required",
      });
    return next();
  };
}
