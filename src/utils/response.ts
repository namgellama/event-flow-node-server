import { Response } from "express";

export function sendResponse(
    res: Response,
    data: unknown,
    statusCode = 200,
    message: string,
) {
    return res.status(statusCode).json({
        success: true,
        message,
        data,
    });
}
