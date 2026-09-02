import app from "./app";
import { env } from "./config/env";
import { logger } from "./config/logger";
import { checkDatabaseConnection } from "./db";

const start = async () => {
    try {
        await checkDatabaseConnection();

        app.listen({
            port: env.PORT,
            host: "0.0.0.0",
        });

        logger.info(
            {
                port: env.PORT,
                environment: env.NODE_ENV,
            },
            "Server started",
        );
    } catch (error) {
        logger.fatal(
            {
                error: error instanceof Error ? error.message : error,
            },
            "Application startup failed",
        );

        process.exit(1);
    }
};

start();
