import { defineRelations } from "drizzle-orm";
import {
    pgEnum,
    pgTable,
    timestamp,
    uuid,
    varchar,
    text,
} from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["USER", "ADMIN"]);
export type Role = (typeof roleEnum.enumValues)[number];

export const usersTable = pgTable("users", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    email: varchar("email", { length: 255 }).notNull().unique(),
    password: varchar("password", { length: 255 }).notNull(),
    role: roleEnum("role").notNull().default("USER"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const eventStatusEnum = pgEnum("event_status", [
    "SCHEDULED",
    "PROCESSING",
    "COMPLETED",
    "CANCELLED",
    "FAILED",
]);

export const eventsTable = pgTable("events", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description").notNull(),
    scheduledAt: timestamp("scheduled_at").notNull(),
    status: eventStatusEnum("status").notNull().default("SCHEDULED"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});
