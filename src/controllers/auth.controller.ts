import { NextFunction, Request, Response } from "express";
import { AppError } from "../errors/app-error";
import * as authService from "../services/auth.service";
import { sendResponse } from "../utils/response";

export async function register(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const newUser = await authService.register(req.body);

        sendResponse(res, newUser, "User registered successfully", 201);
    } catch (error) {
        next(error);
    }
}

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const tokens = await authService.login(res, req.body);

        sendResponse(res, tokens, "User logged in successfully");
    } catch (error) {
        next(error);
    }
}

export async function logout(_req: Request, res: Response, next: NextFunction) {
    try {
        await authService.logout(res);

        sendResponse(res, null, "User logged out successfully");
    } catch (error) {
        next(error);
    }
}

export async function refreshToken(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (!refreshToken) {
            next(new AppError(401, "Refresh token missing"));
            return;
        }

        const accessToken = await authService.refreshToken(refreshToken);

        sendResponse(res, accessToken, "Token refreshed successfully");
    } catch (error) {
        next(error);
    }
}

export async function getMe(req: Request, res: Response, next: NextFunction) {
    try {
        const { password, ...user } = await authService.getMe(req.user!.id);

        sendResponse(res, user, "Current user fetched successfully");
    } catch (error) {
        next(error);
    }
}
