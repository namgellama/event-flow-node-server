import { CreateEmailTemplateInput } from "../schemas/email-template.schema";
import * as emailTemplateRepository from "../repositories/email-template.repository";
import { AppError } from "../errors/app-error";

export async function getAll() {
    return emailTemplateRepository.getAll();
}

export async function getById(id: string) {
    const emailTemplate = await emailTemplateRepository.getById(id);

    if (!emailTemplate) {
        throw new AppError(404, "Email template not found");
    }

    return emailTemplate;
}

export async function create(body: CreateEmailTemplateInput) {
    return emailTemplateRepository.create(body);
}
