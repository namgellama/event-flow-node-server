import { Queue } from "bullmq";
import { redis } from "../config/redis";
import { EventRecipient } from "../types/event-recipient";

export const emailQueue = new Queue("email-queue", {
    connection: redis,
});

export async function scheduleEmails(
    eventId: string,
    recipients: EventRecipient[],
) {
    await emailQueue.addBulk(
        recipients.map((recipient) => ({
            name: "send-email",
            data: {
                eventId,
                userId: recipient.userId,
            },
            opts: {
                attempts: 3,
                backoff: {
                    type: "exponential",
                    delay: 1000,
                },
            },
        })),
    );
}
