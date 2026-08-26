import { db } from "../db";
import { emailTemplatesTable } from "../db/schema";
import { CreateEmailTemplateInput } from "../schemas/email-template.schema";

export async function getAll() {
    return db.select().from(emailTemplatesTable);
}

export async function create(body: CreateEmailTemplateInput) {
    const [emailTemplate] = await db
        .insert(emailTemplatesTable)
        .values(body)
        .returning();

    return emailTemplate;
}
