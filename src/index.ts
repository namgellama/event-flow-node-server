import cookieParser from "cookie-parser";
import express, { Request, Response } from "express";
import { env } from "./config/env";
import { errorHandler } from "./errors/error-handler";
import { notFound } from "./errors/not-found";
import authRoutes from "./routes/auth.routes";
import eventRecipientRoutes from "./routes/event-recipient.route";
import eventRoutes from "./routes/event.routes";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.get("/health", (_req: Request, res: Response) => {
    res.status(200).json({
        status: "ok",
    });
});

app.use("/api/auth", authRoutes);
app.use("/api/events", eventRoutes);
app.use("/api/events/:id", eventRecipientRoutes);

app.use(notFound);
app.use(errorHandler);

app.listen(env.PORT, () => {
    console.log(
        `Server running in ${env.NODE_ENV} environment on PORT ${env.PORT}`,
    );
});
