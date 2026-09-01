import { EventStatus } from "../db/schema";

export type EventContext = Record<string, unknown>;

export type Event = {
    id: string;
    name: string;
    description: string;
    status: EventStatus;
    scheduledAt: Date;
    createdAt: Date;
    updatedAt: Date;
    emailTemplateId: string | null;
    context: EventContext | null;
};
