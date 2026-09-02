import jwt, { TokenExpiredError } from "jsonwebtoken";
import { Role } from "../db/schema";
import { AppError } from "../errors/app-error";

export function signToken(payload: { sub: string; role: string }, secret: string, expiry: string) {
    return jwt.sign(payload, secret, {
        expiresIn: expiry as jwt.SignOptions["expiresIn"],
    });
}

export function verifyToken(token: string, secret: string): { sub: string; role: Role } {
    try {
        return jwt.verify(token, secret) as {
            sub: string;
            role: Role;
        };
    } catch (error) {
        if (error instanceof TokenExpiredError) {
            throw new AppError(401, "Token expired");
        }

        throw new AppError(401, "Invalid token");
    }
}
