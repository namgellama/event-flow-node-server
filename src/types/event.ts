import { EventStatus } from "../db/schema";

export type Event = {
    id: string;
    name: string;
    description: string;
    status: EventStatus;
    scheduledAt: Date;
    createdAt: Date;
    updatedAt: Date;
};
