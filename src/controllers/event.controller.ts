import { NextFunction, Request, Response } from "express";
import * as eventService from "../services/event.service";
import { sendResponse } from "../utils/response";

export async function createEvent(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const event = await eventService.create(req.body);

        sendResponse(res, { event }, "Event created successfully", 201);
    } catch (error) {
        next(error);
    }
}
