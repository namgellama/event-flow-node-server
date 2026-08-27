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

export async function getById(id: string) {
    const [emailTemplate] = await db
        .select()
        .from(emailTemplatesTable)
        .where(eq(emailTemplatesTable.id, id));

    return emailTemplate;
}

export async function create(body: CreateEmailTemplateInput) {
    const [emailTemplate] = await db
        .insert(emailTemplatesTable)
        .values(body)
        .returning();

    return emailTemplate;
}

export async function update(id: string, body: UpdateEmailTemplateInput) {
    const [emailTemplate] = await db
        .update(emailTemplatesTable)
        .set({ ...body, updatedAt: new Date() })
        .where(eq(emailTemplatesTable.id, id))
        .returning();

    return emailTemplate;
}

export async function remove(id: string) {
    await db.delete(emailTemplatesTable).where(eq(emailTemplatesTable.id, id));
}
