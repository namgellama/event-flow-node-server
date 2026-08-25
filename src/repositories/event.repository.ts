import { count, desc, eq } from "drizzle-orm";
import { db } from "../db";
import { eventsTable } from "../db/schema";
import { CreateEventInput } from "../schemas/event.schema";

export async function getAll(limit: number, offset: number) {
    return await db
        .select()
        .from(eventsTable)
        .orderBy(desc(eventsTable.createdAt))
        .limit(limit)
        .offset(offset);
}

export async function getById(id: string) {
    const result = await db
        .select()
        .from(eventsTable)
        .where(eq(eventsTable.id, id));

    return result[0] ?? null;
}

export async function getCount() {
    const result = await db
        .select({ count: count(eventsTable.id) })
        .from(eventsTable);

    return result[0].count;
}

export async function create(body: CreateEventInput) {
    return await db
        .insert(eventsTable)
        .values({ ...body, status: "SCHEDULED" })
        .returning();
}
