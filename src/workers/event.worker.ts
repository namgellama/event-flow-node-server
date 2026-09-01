import { Job, Worker } from "bullmq";
import { redis } from "../config/redis";
import { scheduleEmails } from "../queues/email.queue";
import * as eventRecipientRepository from "../repositories/event-recipient.repository";
import * as eventRepository from "../repositories/event.repository";

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

        await eventRepository.markFailed(eventId);
    }
});

async function processEvent(job: Job) {
    const { eventId } = job.data;

    console.log(`Processing event: ${eventId}`);

    // Claim the event
    const event = await eventRepository.claimEvent(eventId);

    // Already processed/claimed
    if (!event) {
        console.log(`Event ${eventId} is already being processed or completed`);
        return;
    }

    // Get all recipients
    const recipients = await eventRecipientRepository.getByEventId(eventId);

    if (recipients.length === 0) {
        await eventRepository.markCompleted(eventId);
        return;
    }

    // Fan out email jobs
    await scheduleEmails(event.id, recipients);

    console.log(`Queued ${recipients.length} emails for event ${eventId}`);
}

export async function completeEventIfDone(eventId: string) {
    const hasPending =
        await eventRecipientRepository.hasPendingRecipients(eventId);

    if (!hasPending) {
        await eventRepository.markCompleted(eventId);
    }
}
