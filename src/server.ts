import app from "./app";
import { env } from "./config/env";

app.listen(env.PORT, () => {
    console.log(
        `Server running in ${env.NODE_ENV} environment on PORT ${env.PORT}`,
    );
});
