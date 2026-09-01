import { Job, Worker } from "bullmq";
import { and, count, eq, inArray } from "drizzle-orm";
import { redis } from "../config/redis";
import { db } from "../db";
import { eventRecipientsTable, eventsTable } from "../db/schema";
import { scheduleEmails } from "../queues/email.queue";

export const eventWorker = new Worker("event-queue", processEvent, {
    connection: redis,
    concurrency: 5,
});

eventWorker.on("completed", (job: Job) => {
    console.log(`Job ${job.id} completed`);
});

eventWorker.on("failed", async (job: Job | undefined, error: Error) => {
    if (!job) return;

    console.error(`Job ${job.id} failed:`, error.message);

    if (job.attemptsMade >= (job.opts.attempts ?? 1)) {
        const { eventId } = job.data;

        await db
            .update(eventsTable)
            .set({ status: "FAILED", updatedAt: new Date() })
            .where(eq(eventsTable.id, eventId));
    }
});

async function processEvent(job: Job) {
    const { eventId } = job.data;

    console.log(`Processing event: ${eventId}`);

    // Claim the event
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

    // Already processed/claimed
    if (!event) {
        console.log(`Event ${eventId} is already being processed or completed`);
        return;
    }

    // Get all recipients
    const recipients = await db
        .select()
        .from(eventRecipientsTable)
        .where(eq(eventRecipientsTable.eventId, eventId));

    if (recipients.length === 0) {
        await db
            .update(eventsTable)
            .set({
                status: "COMPLETED",
                updatedAt: new Date(),
            })
            .where(eq(eventsTable.id, eventId));
        return;
    }

    // Fan out email jobs
    await scheduleEmails(event.id, recipients);

    console.log(`Queued ${recipients.length} emails for event ${eventId}`);
}

export async function completeEventIfDone(eventId: string) {
    const [result] = await db
        .select({ count: count() })
        .from(eventRecipientsTable)
        .where(
            and(
                eq(eventRecipientsTable.eventId, eventId),
                inArray(eventRecipientsTable.status, ["PENDING", "SENDING"]),
            ),
        );

    if (result.count > 0) {
        return;
    }

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
