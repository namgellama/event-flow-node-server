import { Queue } from "bullmq";
import { redis } from "../config/redis";

export const eventQueue = new Queue("event-queue", {
    connection: redis,
});
