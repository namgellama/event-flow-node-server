import { NextFunction, Request, Response } from "express";
import { z, ZodError } from "zod";

export function validateBody(schema: z.ZodType) {
    return (req: Request, _res: Response, next: NextFunction) => {
        const result = schema.safeParse(req.body);

        if (!result.success) {
            return next(new ZodError(result.error.issues));
        }

        req.body = result.data;
        next();
    };
}
