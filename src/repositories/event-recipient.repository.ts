import { and, count, eq, inArray } from "drizzle-orm";
import { db } from "../db";
import { eventRecipientsTable } from "../db/schema";
import { EventRecipient } from "../types/event-recipient";

export async function findByEventAndUser(
    eventId: string,
    userId: string,
): Promise<EventRecipient | null> {
    const [eventRecipient] = await db
        .select()
        .from(eventRecipientsTable)
        .where(
            and(
                eq(eventRecipientsTable.eventId, eventId),
                eq(eventRecipientsTable.userId, userId),
            ),
        );

    return eventRecipient ?? null;
}

export async function create(
    eventId: string,
    userId: string,
): Promise<EventRecipient> {
    const [eventRecipient] = await db
        .insert(eventRecipientsTable)
        .values({ eventId, userId })
        .returning();

    return eventRecipient;
}

export async function getByEventId(eventId: string): Promise<EventRecipient[]> {
    return db
        .select()
        .from(eventRecipientsTable)
        .where(eq(eventRecipientsTable.eventId, eventId));
}

export async function hasPendingRecipients(eventId: string): Promise<boolean> {
    const [result] = await db
        .select({ count: count() })
        .from(eventRecipientsTable)
        .where(
            and(
                eq(eventRecipientsTable.eventId, eventId),
                inArray(eventRecipientsTable.status, ["PENDING", "SENDING"]),
            ),
        );

    return result.count > 0;
}

export async function markSending(
    eventId: string,
    userId: string,
): Promise<void> {
    await db
        .update(eventRecipientsTable)
        .set({
            status: "SENDING",
        })
        .where(
            and(
                eq(eventRecipientsTable.eventId, eventId),
                eq(eventRecipientsTable.userId, userId),
                eq(eventRecipientsTable.status, "PENDING"),
            ),
        );
}

export async function markSent(
    eventId: string,
    userId: string,
    data: { providerMessageId: string | undefined },
): Promise<void> {
    await db
        .update(eventRecipientsTable)
        .set({
            status: "SENT",
            providerMessageId: data?.providerMessageId,
        })
        .where(
            and(
                eq(eventRecipientsTable.eventId, eventId),
                eq(eventRecipientsTable.userId, userId),
            ),
        );
}

export async function markFailed(
    eventId: string,
    userId: string,
): Promise<void> {
    await db
        .update(eventRecipientsTable)
        .set({
            status: "FAILED",
        })
        .where(
            and(
                eq(eventRecipientsTable.eventId, eventId),
                eq(eventRecipientsTable.userId, userId),
            ),
        );
}
