import { eq } from "drizzle-orm";
import { db } from "../db";
import { emailTemplatesTable } from "../db/schema";
import {
    CreateEmailTemplateInput,
    UpdateEmailTemplateInput,
} from "../schemas/email-template.schema";

export async function getAll() {
    return db.select().from(emailTemplatesTable);
}

export async function findById(emailTemplateId: string) {
    const [emailTemplate] = await db
        .select()
        .from(emailTemplatesTable)
        .where(eq(emailTemplatesTable.id, emailTemplateId));

    return emailTemplate;
}

export async function create(body: CreateEmailTemplateInput) {
    const [emailTemplate] = await db
        .insert(emailTemplatesTable)
        .values(body)
        .returning();

    return emailTemplate;
}

export async function update(
    emailTemplateId: string,
    body: UpdateEmailTemplateInput,
) {
    const [emailTemplate] = await db
        .update(emailTemplatesTable)
        .set({ ...body, updatedAt: new Date() })
        .where(eq(emailTemplatesTable.id, emailTemplateId))
        .returning();

    return emailTemplate;
}

export async function remove(emailTemplateId: string) {
    await db
        .delete(emailTemplatesTable)
        .where(eq(emailTemplatesTable.id, emailTemplateId));
}
