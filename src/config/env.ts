import dotenv from "dotenv";
import { z } from "zod";

dotenv.config();

const envSchema = z.object({
    NODE_ENV: z
        .enum(["development", "production", "test"])
        .default("development"),
    PORT: z.coerce.number().int().positive().default(8000),
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
