import { eq } from "drizzle-orm";
import { db } from "../db";
import { Role, usersTable } from "../db/schema";
import { RegisterInput } from "../schemas/auth.schema";
import { User } from "../types/user";

export type UserCreate = RegisterInput & { role: Role };

export async function findByEmail(email: string): Promise<User | null> {
    const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.email, email));

    return user ?? null;
}

export async function findById(userId: string): Promise<User | null> {
    const [user] = await db
        .select()
        .from(usersTable)
        .where(eq(usersTable.id, userId));

    return user ?? null;
}

export async function create(
    body: UserCreate,
): Promise<Omit<User, "password">> {
    const [user] = await db.insert(usersTable).values(body).returning({
        id: usersTable.id,
        name: usersTable.name,
        email: usersTable.email,
        role: usersTable.role,
        createdAt: usersTable.createdAt,
        updatedAt: usersTable.updatedAt,
    });

    return user;
}
