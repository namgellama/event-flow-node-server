import { Queue } from "bullmq";
import { redis } from "../config/redis";

export const eventQueue = new Queue("event-queue", {
    connection: redis,
});

export async function scheduleEvent(eventId: string, delay: number) {
    return await eventQueue.add(
        "process-event",
        {
            eventId,
        },
        {
            delay,
            attempts: 3,
            backoff: {
                type: "exponential",
                delay: 1000,
            },
            removeOnComplete: true,
            removeOnFail: false,
        },
    );
}
