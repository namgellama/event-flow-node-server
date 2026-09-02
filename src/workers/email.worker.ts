import { Job, Worker } from "bullmq";
import { logger } from "../config/logger";
import { redis } from "../config/redis";
import * as emailTemplateRepository from "../repositories/email-template.repository";
import * as eventRecipientRepository from "../repositories/event-recipient.repository";
import * as eventRepository from "../repositories/event.repository";
import * as userRepository from "../repositories/user.repository";
import { renderTemplate } from "../utils/render-template";
import { sendEmail } from "../utils/send-email";
import { completeEventIfDone } from "./event.worker";

export const emailWorker = new Worker("email-queue", processEmail, {
    connection: redis,
    concurrency: 5,
});

emailWorker.on("completed", (job: Job) => {
    logger.info(
        {
            jobId: job.id,
            eventId: job.data.eventId,
            userId: job.data.userId,
        },
        "Email job completed",
    );
});

emailWorker.on("failed", async (job: Job | undefined, error: Error) => {
    if (!job) return;

    const { eventId, userId } = job.data;

    logger.error(
        {
            jobId: job.id,
            eventId,
            userId,
            attempt: job.attemptsMade,
            maxAttempts: job.opts.attempts ?? 1,
            error: error.message,
        },
        "Email job failed",
    );

    if (job.attemptsMade >= (job.opts.attempts ?? 1)) {
        await eventRecipientRepository.markFailed(eventId, userId);
        await completeEventIfDone(eventId);
    }
});

async function processEmail(job: Job) {
    const { eventId, userId } = job.data;

    const logContext = { jobId: job.id, eventId, userId };

    logger.info(logContext, "Processing email job");

    // Get recipient
    const eventRecipient = await eventRecipientRepository.findByEventAndUser(
        eventId,
        userId,
    );

    if (!eventRecipient) {
        throw new Error(`Event recipient not found: ${eventId}/${userId}`);
    }

    if (eventRecipient.status === "SENT") {
        logger.info(logContext, "Email already sent, skipping");
        return;
    }

    await eventRecipientRepository.markSending(eventId, userId);

    // Get user
    const user = await userRepository.findById(userId);

    if (!user) {
        throw new Error(`User not found: ${userId}`);
    }

    // Get event
    const event = await eventRepository.findById(eventId);

    if (!event) {
        throw new Error(`Event not found: ${eventId}`);
    }

    if (!event.emailTemplateId) {
        throw new Error("Event does not have an email template");
    }

    // Get email template
    const emailTemplate = await emailTemplateRepository.findById(
        event.emailTemplateId,
    );

    if (!emailTemplate) {
        throw new Error(`Email template not found: ${event.emailTemplateId}`);
    }

    const context = {
        ...(event.context ?? {}),
        recipientName: user.name,
    };

    const subject = renderTemplate(emailTemplate.subject, context);

    const html = renderTemplate(emailTemplate.html, context);

    // Send email
    const { data, error } = await sendEmail({
        from: emailTemplate.sender,
        to: user.email,
        subject,
        html,
    });

    if (error) {
        throw new Error(error.message);
    }

    // Update recipient
    await eventRecipientRepository.markSent(eventId, userId, {
        providerMessageId: data.id,
    });

    logger.info(
        {
            ...logContext,
            providerMessageId: data.id,
        },
        "Email sent successfully",
    );

    await completeEventIfDone(eventId);
}
