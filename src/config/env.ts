import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
    NODE_ENV: z
        .enum(["development", "production", "test"])
        .default("development"),
    PORT: z.coerce.number().int().positive().default(8000),
    LOG_LEVEL: z
        .enum(["info", "error", "warn", "trace", "silent", "debug", "fatal"])
        .default("info"),
    DATABASE_URL: z.string(),
    JWT_ACCESS_SECRET: z.string(),
    JWT_ACCESS_EXPIRY: z.string(),
    JWT_REFRESH_SECRET: z.string(),
    JWT_REFRESH_EXPIRY: z.string(),
    RESEND_API_KEY: z.string(),
    REDIS_URL: z.string(),
    EVENT_QUEUE_DELAY: z.coerce.number().int().positive().default(60000),
});

const parsed = envSchema.safeParse(process.env);

if (!parsed.success) {
    console.error("Invalid environment variables:");
    console.error(
        JSON.stringify(z.treeifyError(parsed.error).properties, null, 2),
    );
    process.exit(1);
}

export const env = parsed.data;
export type Env = z.infer<typeof envSchema>;
