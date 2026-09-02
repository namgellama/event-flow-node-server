import { eq } from "drizzle-orm";
import { db } from "../db";
import { emailTemplatesTable } from "../db/schema";
import {
    CreateEmailTemplateInput,
    UpdateEmailTemplateInput,
} from "../schemas/email-template.schema";
import { EmailTemplate } from "../types/email-template";

export async function getAll(): Promise<EmailTemplate[]> {
    return db.select().from(emailTemplatesTable);
}

export async function findById(emailTemplateId: string): Promise<EmailTemplate | null> {
    const [emailTemplate] = await db
        .select()
        .from(emailTemplatesTable)
        .where(eq(emailTemplatesTable.id, emailTemplateId));

    return emailTemplate ?? null;
}

export async function create(body: CreateEmailTemplateInput): Promise<EmailTemplate> {
    const [emailTemplate] = await db.insert(emailTemplatesTable).values(body).returning();

    return emailTemplate;
}

export async function update(
    emailTemplateId: string,
    body: UpdateEmailTemplateInput,
): Promise<EmailTemplate> {
    const [emailTemplate] = await db
        .update(emailTemplatesTable)
        .set({ ...body, updatedAt: new Date() })
        .where(eq(emailTemplatesTable.id, emailTemplateId))
        .returning();

    return emailTemplate;
}

export async function remove(emailTemplateId: string): Promise<void> {
    await db.delete(emailTemplatesTable).where(eq(emailTemplatesTable.id, emailTemplateId));
}
