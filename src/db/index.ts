import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "../config/env";
import { usersTable } from "./schema";
import bcrypt from "bcryptjs";
import { logger } from "../config/logger";

const pool = new Pool({ connectionString: env.DATABASE_URL });

pool.on("connect", () => {
    logger.info("PostgreSQL connection established");
});

pool.on("error", (error) => {
    logger.error(
        {
            service: "postgres",
            error: error.message,
        },
        "PostgreSQL pool error",
    );
});

export const db = drizzle({ client: pool });

export async function checkDatabaseConnection() {
    try {
        const client = await pool.connect();

        client.release();

        logger.info("PostgreSQL database connected");
    } catch (error) {
        logger.fatal(
            {
                service: "postgres",
                error: error instanceof Error ? error.message : error,
            },
            "PostgreSQL database connection failed",
        );

        throw error;
    }
}

// async function main() {
//     const user: typeof usersTable.$inferInsert = {
//         name: "Admin",
//         email: "admin@admin.com",
//         password: bcrypt.hashSync("admin"),
//         role: "ADMIN",
//     };
//     await db.insert(usersTable).values(user);
//     console.log("Admin user created!");
// }

// main();
