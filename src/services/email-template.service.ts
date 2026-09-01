import { AppError } from "../errors/app-error";
import * as emailTemplateRepository from "../repositories/email-template.repository";
import {
    CreateEmailTemplateInput,
    UpdateEmailTemplateInput,
} from "../schemas/email-template.schema";
import { EmailTemplate } from "../types/email-template";

export async function getAll(): Promise<EmailTemplate[]> {
    return emailTemplateRepository.getAll();
}

export async function findById(
    emailTemplateId: string,
): Promise<EmailTemplate> {
    const emailTemplate =
        await emailTemplateRepository.findById(emailTemplateId);

    if (!emailTemplate) {
        throw new AppError(404, "Email template not found");
    }

    return emailTemplate;
}

export async function create(
    body: CreateEmailTemplateInput,
): Promise<EmailTemplate> {
    return emailTemplateRepository.create(body);
}

export async function update(
    emailTemplateId: string,
    body: UpdateEmailTemplateInput,
): Promise<EmailTemplate> {
    await findById(emailTemplateId);

    return emailTemplateRepository.update(emailTemplateId, body);
}

export async function remove(emailTemplateId: string): Promise<void> {
    await findById(emailTemplateId);

    emailTemplateRepository.remove(emailTemplateId);
}
