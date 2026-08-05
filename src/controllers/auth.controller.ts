import { NextFunction, Request, Response } from "express";
import * as authService from "../services/auth.service";
import { sendResponse } from "../utils/response";

export async function register(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const newUser = await authService.register(req.body);

        sendResponse(res, { newUser }, "User registered successfully", 201);
    } catch (error) {
        next(error);
    }
}

export async function login(req: Request, res: Response, next: NextFunction) {
    try {
        const tokens = await authService.login(res, req.body);

        sendResponse(res, { ...tokens }, "User logged in successfully");
    } catch (error) {
        next(error);
    }
}
