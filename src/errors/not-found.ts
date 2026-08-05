import { NextFunction, Request, Response } from "express";
import { AppError } from "./app-error";

export function notFound(req: Request, _res: Response, next: NextFunction) {
    next(new AppError(404, `Route ${req.originalUrl} not found`));
}
