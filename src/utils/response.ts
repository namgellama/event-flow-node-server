import { Response } from "express";

export function sendResponse(res: Response, data: unknown, message: string, statusCode = 200) {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
}
