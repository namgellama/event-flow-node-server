import { and, eq } from "drizzle-orm";
import { db } from "../db";
import { eventRecipientsTable } from "../db/schema";

export async function getById(eventId: string, userId: string) {
    const [eventRecipient] = await db
        .select()
        .from(eventRecipientsTable)
        .where(
            and(
                eq(eventRecipientsTable.eventId, eventId),
                eq(eventRecipientsTable.userId, userId),
            ),
        );

    return eventRecipient;
}

export async function create(eventId: string, userId: string) {
    const [eventRecipient] = await db
        .insert(eventRecipientsTable)
        .values({ eventId, userId })
        .returning();

    return eventRecipient;
}
