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

export async function getEmailTemplate(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
) {
    try {
        const emailTemplate = await emailTemplateService.getById(req.params.id);

        sendResponse(res, emailTemplate, "Email Template fetched successfully");
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

export async function updateEmailTemplate(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
) {
    try {
        const emailTemplate = await emailTemplateService.update(
            req.params.id,
            req.body,
        );

        sendResponse(res, emailTemplate, "Email Template updated successfully");
    } catch (error) {
        next(error);
    }
}

export async function deleteEmailTemplate(
    req: Request<{ id: string }>,
    res: Response,
    next: NextFunction,
) {
    try {
        await emailTemplateService.remove(req.params.id);

        sendResponse(res, null, "Email Template deleted successfully", 204);
    } catch (error) {
        next(error);
    }
}
