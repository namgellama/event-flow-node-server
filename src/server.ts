import app from "./app";
import { env } from "./config/env";
import { logger } from "./config/logger";

app.listen(env.PORT, () => {
    logger.info(
        `Server running in ${env.NODE_ENV} environment on PORT ${env.PORT}`,
    );
});
