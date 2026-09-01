import { Job, Worker } from "bullmq";
import { redis } from "../config/redis";
import { resend } from "../config/resend";
import * as emailTemplateRepository from "../repositories/email-template.repository";
import * as eventRecipientRepository from "../repositories/event-recipient.repository";
import * as eventRepository from "../repositories/event.repository";
import * as userRepository from "../repositories/user.repository";
import { renderTemplate } from "../utils/template-renderer";
import { completeEventIfDone } from "./event.worker";

export const emailWorker = new Worker("email-queue", sendEmail, {
    connection: redis,
    concurrency: 5,
});

emailWorker.on("completed", (job: Job) => {
    console.log(`Job ${job.id} completed`);
});

emailWorker.on("failed", async (job: Job | undefined, error: Error) => {
    if (!job) return;

    const { eventId, userId } = job.data;

    console.error(`Email job ${job.id} failed:`, error.message);

    if (job.attemptsMade >= (job.opts.attempts ?? 1)) {
        await eventRecipientRepository.markFailed(eventId, userId);

        await completeEventIfDone(eventId);
    }
});

async function sendEmail(job: Job) {
    const { eventId, userId } = job.data;

    console.log(`Sending email for event ${eventId} to recipient ${userId}`);

    // Get recipient
    const eventRecipient = await eventRecipientRepository.getById(
        eventId,
        userId,
    );

    if (!eventRecipient) {
        throw new Error(`Event recipient not found: ${eventId}/${userId}`);
    }

    if (eventRecipient.status === "SENT") {
        console.log(`Email already sent to ${userId}`);
        return;
    }

    await eventRecipientRepository.markSending(eventId, userId);

    // Get user
    const user = await userRepository.findById(userId);

    if (!user) {
        throw new Error(`User not found: ${userId}`);
    }

    // Get event
    const event = await eventRepository.getById(eventId);

    if (!event) {
        throw new Error(`Event not found: ${eventId}`);
    }

    if (!event.emailTemplateId) {
        throw new Error("Event does not have an email template");
    }

    // Get email template
    const emailTemplate = await emailTemplateRepository.getById(
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
    const { data, error } = await resend.emails.send({
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

    console.log(`Email sent to ${user.email}`);

    await completeEventIfDone(eventId);
}
