import { db } from "../db";
import { eventsTable } from "../db/schema";
import { CreateEventInput } from "../schemas/event.schema";

export async function create(body: CreateEventInput) {
    return await db
        .insert(eventsTable)
        .values({ ...body, status: "SCHEDULED" })
        .returning();
}
