import { logger } from "../config/logger";
import "./email.worker";
import "./event.worker";

logger.info(
    {
        workers: ["email-queue", "event-queue"],
    },
    "Workers started",
);
