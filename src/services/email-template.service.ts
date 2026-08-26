import { CreateEmailTemplateInput } from "../schemas/email-template.schema";
import * as emailTemplateRepository from "../repositories/email-template.repository";

export async function getAll() {
    return emailTemplateRepository.getAll();
}

export async function create(body: CreateEmailTemplateInput) {
    return emailTemplateRepository.create(body);
}
