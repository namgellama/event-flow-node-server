import { NextFunction, Request, Response } from "express";
import * as eventRecipientService from "../services/event-recipient.service";
import { sendResponse } from "../utils/response";

export async function createEventRecipient(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
) {
    try {
        const eventRecipient = await eventRecipientService.create(
            req.params.id,
            req.user!.id,
        );

        sendResponse(
            res,
            { eventRecipient },
            "Event Recipient created successfully",
            201,
        );
    } catch (error) {
        next(error);
    }
}
