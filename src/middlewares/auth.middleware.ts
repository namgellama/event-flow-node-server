import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error";
import * as usersRepository from "../repositories/user.repository";
import { verifyToken } from "../utils/jwt";

export async function protect(
    req: Request,
    _res: Response,
    next: NextFunction,
) {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith("Bearer ")) {
            next(new AppError(401, "Unauthenticated - no token found"));
            return;
        }

        const token = authHeader.split(" ")[1];

        const payload = verifyToken(token);

        const user = await usersRepository.findById(payload.sub);

        if (!user) {
            next(new AppError(401, "Unauthenticated - user not found"));
            return;
        }

        req.user = {
            id: user.id,
            email: user.email,
            role: user.role,
        };

        next();
    } catch (error) {
        next(error);
    }
}
