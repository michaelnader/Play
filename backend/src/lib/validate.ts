import type { Request, Response, NextFunction } from "express";
import { ZodSchema, ZodError } from "zod";
import { HttpError } from "./httpError.js";

export function validateBody<T>(schema: ZodSchema<T>) {
  return (req: Request, _res: Response, next: NextFunction) => {
    try {
      req.body = schema.parse(req.body);
      next();
    } catch (err) {
      if (err instanceof ZodError) {
        return next(
          new HttpError(400, "validation_error", "Invalid request body", err.flatten())
        );
      }
      next(err);
    }
  };
}
