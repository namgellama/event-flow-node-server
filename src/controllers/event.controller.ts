import { NextFunction, Request, Response } from "express";
import * as eventService from "../services/event.service";
import { sendResponse } from "../utils/response";

export async function getAllEvents(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const page = Number(req.query.page) || 1;
    const pageSize = Number(req.query.pageSize) || 20;

    try {
        const { events, pagination } = await eventService.getAll(
            page,
            pageSize,
        );

        sendResponse(
            res,
            { events, pagination },
            "Events fetched successfully",
        );
    } catch (error) {
        next(error);
    }
}

export async function getEvent(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
) {
    try {
        const event = await eventService.getById(req.params.id);

        sendResponse(res, { event }, "Event fetched successfully");
    } catch (error) {
        next(error);
    }
}

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

export async function updateEvent(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
) {
    try {
        const event = await eventService.update(req.params.id, req.body);

        sendResponse(res, { event }, "Event updated successfully");
    } catch (error) {
        next(error);
    }
}

export async function deleteEvent(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
) {
    try {
        await eventService.remove(req.params.id);

        sendResponse(res, null, "Event deleted successfully");
    } catch (error) {
        next(error);
    }
}
