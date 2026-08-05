import { eq } from "drizzle-orm";
import { db } from "../db";
import { Role, usersTable } from "../db/schema";
import { RegisterInput } from "../schemas/auth.schema";
import { User } from "../types/user";

export type UserCreate = RegisterInput & { role: Role };

export async function findByEmail(email: string): Promise<User | null> {
    const result = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email));

    return result[0] ?? null;
}

export async function findById(id: string): Promise<User | null> {
    const result = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, id));

    return result[0] ?? null;
}

export async function create(body: UserCreate) {
    return await db.insert(usersTable).values(body).returning({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        role: usersTable.role,
        createdAt: usersTable.createdAt,
        updatedAt: usersTable.updatedAt,
    });
}
