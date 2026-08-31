import { Job, Worker } from "bullmq";
import { redis } from "../config/redis";
import { db } from "../db";
import { eventRecipientsTable, eventsTable } from "../db/schema";
import { and, eq } from "drizzle-orm";

export const eventWorker = new Worker(
    "event-queue",
    async (job: Job) => {
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
            console.log(
                `Event ${eventId} is already being processed or completed`,
            );
            return;
        }

        // Get all recipients
        const recipients = await db
            .select()
            .from(eventRecipientsTable)
            .where(eq(eventRecipientsTable.eventId, eventId));

        if (recipients.length === 0) {
            console.log(`No recipients found for event ${eventId}`);
            return;
        }

        // Fan out email jobs

        console.log(`Queued ${recipients.length} emails for event ${eventId}`);
    },
    {
        connection: redis,
        concurrency: 5,
    },
);

eventWorker.on("completed", (job: Job) => {
    console.log(`Job ${job.id} completed`);
});

eventWorker.on("failed", (job: Job | undefined, error: Error) => {
    console.error(`Job ${job?.id} failed:`, error);
});
