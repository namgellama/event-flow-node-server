import { NextFunction, Request, Response } from "express";
import * as emailTemplateService from "../services/email-template.service";
import { sendResponse } from "../utils/response";

export async function getAllEmailTemplates(
    _req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const emailTemplates = await emailTemplateService.getAll();

        sendResponse(
            res,
            emailTemplates,
            "Email Templates fetched successfully",
        );
    } catch (error) {
        next(error);
    }
}

export async function createEmailTemplate(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    try {
        const emailTemplate = await emailTemplateService.create(req.body);

        sendResponse(
            res,
            emailTemplate,
            "Email template created successfully",
            201,
        );
    } catch (error) {
        next(error);
    }
}
