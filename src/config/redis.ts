import IORedis from "ioredis";
import { env } from "./env";
import { logger } from "./logger";

export const redis = new IORedis(env.REDIS_URL, {
    maxRetriesPerRequest: null,
});

redis.on("connect", () => {
    logger.info("Redis connection established");
});

redis.on("ready", () => {
    logger.info("Redis client ready");
});

redis.on("error", (error) => {
    logger.error(
        {
            service: "redis",
            error: error.message,
            code: "code" in error ? error.code : undefined,
        },
        "Redis connection error",
    );
});

redis.on("close", () => {
    logger.warn("Redis connection closed");
});

redis.on("reconnecting", (delay: number) => {
    logger.warn(
        {
            service: "redis",
            delay,
        },
        "Redis reconnecting",
    );
});
