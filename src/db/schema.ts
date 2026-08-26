import {
    pgEnum,
    pgTable,
    text,
    timestamp,
    uuid,
    varchar,
    primaryKey,
    boolean,
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
export type EventStatus = (typeof eventStatusEnum.enumValues)[number];

export const eventsTable = pgTable("events", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    description: text("description").notNull(),
    scheduledAt: timestamp("scheduled_at").notNull(),
    status: eventStatusEnum("status").notNull().default("SCHEDULED"),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),

    emailTemplateId: uuid("emailTemplateId").references(
        () => emailTemplatesTable.id,
    ),
});

export const emailTemplatesTable = pgTable("event_templates", {
    id: uuid("id").primaryKey().defaultRandom(),
    name: varchar("name", { length: 255 }).notNull(),
    sender: varchar("sender", { length: 255 }).notNull(),
    subject: varchar("subject", { length: 500 }).notNull(),
    html: text("html").notNull(),
    isReusable: boolean("is_reusable").notNull().default(true),
    createdAt: timestamp("created_at").notNull().defaultNow(),
    updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const eventRecipientStatusEnum = pgEnum("event_recipient_status", [
    "PENDING",
    "SENT",
    "FAILED",
]);
export type EventRecipientStatus =
    (typeof eventRecipientStatusEnum.enumValues)[number];

export const eventRecipientsTable = pgTable(
    "event_recipients",
    {
        eventId: uuid("event_id")
            .notNull()
            .references(() => eventsTable.id, {
                onDelete: "cascade",
            }),
        userId: uuid("user_id")
            .notNull()
            .references(() => usersTable.id, {
                onDelete: "cascade",
            }),
        providerMessageId: varchar("provider_message_id", {
            length: 255,
        }).notNull(),
        status: eventRecipientStatusEnum("status").notNull().default("PENDING"),
        createdAt: timestamp("created_at").notNull().defaultNow(),
    },
    (table) => [
        primaryKey({
            columns: [table.eventId, table.userId],
        }),
    ],
);
