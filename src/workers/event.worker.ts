import { Job, Worker } from "bullmq";
import { logger } from "../config/logger";
import { redis } from "../config/redis";
import { scheduleEmails } from "../queues/email.queue";
import * as eventRecipientRepository from "../repositories/event-recipient.repository";
import * as eventRepository from "../repositories/event.repository";

export const eventWorker = new Worker("event-queue", processEvent, {
    connection: redis,
    concurrency: 5,
});

eventWorker.on("completed", (job: Job) => {
    logger.info(
        {
            jobId: job.id,
            eventId: job.data.eventId,
        },
        "Event job completed",
    );
});

eventWorker.on("failed", async (job: Job | undefined, error: Error) => {
    if (!job) return;

    const { eventId } = job.data;
    const maxAttempts = job.opts.attempts ?? 1;
    const isFinalAttempt = job.attemptsMade >= maxAttempts;

    logger.error(
        {
            jobId: job.id,
            eventId,
            attempt: job.attemptsMade,
            maxAttempts,
            error: error.message,
        },
        isFinalAttempt ? "Event job permanently failed" : "Event job failed, will retry",
    );

    if (isFinalAttempt) {
        await eventRepository.markFailed(eventId);
    }
});

async function processEvent(job: Job) {
    const { eventId } = job.data;

    const logContext = {
        jobId: job.id,
        eventId,
    };

    logger.info(logContext, "Processing event job");

    // Claim the event
    const event = await eventRepository.claimEvent(eventId);

    // Already processed/claimed
    if (!event) {
        logger.info(logContext, "Event already being processed or completed, skipping");
        return;
    }

    // Get all recipients
    const recipients = await eventRecipientRepository.getByEventId(eventId);

    if (recipients.length === 0) {
        await eventRepository.markCompleted(eventId);

        logger.info(logContext, "Event has no recipients, marked as completed");

        return;
    }

    // Fan out email jobs
    await scheduleEmails(event.id, recipients);

    logger.info(
        {
            ...logContext,
            recipientCount: recipients.length,
        },
        "Email jobs queued",
    );
}

export async function completeEventIfDone(eventId: string) {
    const hasPending = await eventRecipientRepository.hasPendingRecipients(eventId);

    if (!hasPending) {
        await eventRepository.markCompleted(eventId);

        logger.info({ eventId }, "All recipients processed, event marked as completed");
    }
}
