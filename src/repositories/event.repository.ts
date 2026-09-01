import { and, count, desc, eq } from "drizzle-orm";
import { db } from "../db";
import { eventsTable } from "../db/schema";
import { CreateEventInput, UpdateEventInput } from "../schemas/event.schema";
import { Event } from "../types/event";

export async function getAll(limit: number, offset: number): Promise<Event[]> {
    return await db
        .select()
        .from(eventsTable)
        .orderBy(desc(eventsTable.createdAt))
        .limit(limit)
        .offset(offset);
}

export async function findById(eventId: string): Promise<Event | null> {
    const [event] = await db
        .select()
        .from(eventsTable)
        .where(eq(eventsTable.id, eventId));

    return event ?? null;
}

export async function getCount(): Promise<number> {
    const result = await db
        .select({ count: count(eventsTable.id) })
        .from(eventsTable);

    return result[0].count;
}

export async function create(body: CreateEventInput): Promise<Event> {
    const [event] = await db
        .insert(eventsTable)
        .values({ ...body, status: "SCHEDULED" })
        .returning();

    return event;
}

export async function update(
    id: string,
    body: UpdateEventInput,
): Promise<Event> {
    const [event] = await db
        .update(eventsTable)
        .set({ ...body, updatedAt: new Date() })
        .where(eq(eventsTable.id, id))
        .returning();

    return event;
}

export async function remove(eventId: string): Promise<void> {
    await db.delete(eventsTable).where(eq(eventsTable.id, eventId));
}

export async function claimEvent(eventId: string): Promise<Event> {
    const [event] = await db
        .update(eventsTable)
        .set({
            status: "PROCESSING",
        })
        .where(
            and(
                eq(eventsTable.id, eventId),
                eq(eventsTable.status, "SCHEDULED"),
            ),
        )
        .returning();

    return event;
}

export async function markCompleted(eventId: string): Promise<void> {
    await db
        .update(eventsTable)
        .set({ status: "COMPLETED", updatedAt: new Date() })
        .where(
            and(
                eq(eventsTable.id, eventId),
                eq(eventsTable.status, "PROCESSING"),
            ),
        );
}

export async function markFailed(eventId: string): Promise<void> {
    await db
        .update(eventsTable)
        .set({ status: "FAILED", updatedAt: new Date() })
        .where(eq(eventsTable.id, eventId));
}
