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

        sendResponse(res, { newUser }, 201, "User registered successfully");
    } catch (error) {
        next(error);
    }
}
