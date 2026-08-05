import "dotenv/config";
import { drizzle } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import { env } from "../config/env";
import { usersTable } from "./schema";
import bcrypt from "bcryptjs";

const pool = new Pool({ connectionString: env.DATABASE_URL });

const db = drizzle({ client: pool });

async function main() {
    const user: typeof usersTable.$inferInsert = {
        name: "Admin",
        email: "admin@admin.com",
        password: bcrypt.hashSync("admin"),
        role: "ADMIN",
    };
    await db.insert(usersTable).values(user);
    console.log("Admin user created!");
}

main();
