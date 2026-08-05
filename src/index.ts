import express, { Request, Response } from "express";
import { env } from "./config/env";
import { errorHandler } from "./errors/error-handler";
import { notFound } from "./errors/not-found";

const app = express();

app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({
        status: "ok",
    });
});

app.use(notFound);
app.use(errorHandler);

app.listen(env.PORT, () => {
    console.log(
        `Server running in ${env.NODE_ENV} environment on PORT ${env.PORT}`,
    );
});
