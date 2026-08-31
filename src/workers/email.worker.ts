import { Job, Worker } from "bullmq";
import { and, eq } from "drizzle-orm";
import { redis } from "../config/redis";
import { resend } from "../config/resend";
import { db } from "../db";
import {
    emailTemplatesTable,
    eventRecipientsTable,
    eventsTable,
    usersTable,
} from "../db/schema";
import { renderTemplate } from "../utils/template-renderer";

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
});

async function sendEmail(job: Job) {
    const { eventId, userId } = job.data;

    console.log(`Sending email for event ${eventId} to recipient ${userId}`);

    // Get recipient
    const [eventRecipient] = await db
        .select()
        .from(eventRecipientsTable)
        .where(
            and(
                eq(eventRecipientsTable.eventId, eventId),
                eq(eventRecipientsTable.userId, userId),
            ),
        );

    if (!eventRecipient) {
        console.log("Event recipient not found");
        return;
    }

    // Get user
    const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, userId));

    if (!user) {
        console.log("User not found");
        return;
    }

    // Get event
    const [event] = await db
        .select()
        .from(eventsTable)
        .where(eq(eventsTable.id, eventId));

    if (!event) {
        console.log("Event not found");
        return;
    }

    if (!event.emailTemplateId) {
        throw new Error("Event does not have an email template");
    }

    // Get email template
    const [emailTemplate] = await db
        .select()
        .from(emailTemplatesTable)
        .where(eq(emailTemplatesTable.id, event.emailTemplateId));

    if (!emailTemplate) {
        console.log(`Email template ${event.emailTemplateId} not found`);
        throw new Error("Email template not found");
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
    await db
        .update(eventRecipientsTable)
        .set({
            status: "SENT",
            providerMessageId: data?.id,
        })
        .where(
            and(
                eq(eventRecipientsTable.eventId, eventId),
                eq(eventRecipientsTable.userId, userId),
            ),
        );

    console.log(`Email sent to ${user.email}`);
}
