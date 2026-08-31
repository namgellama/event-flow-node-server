import { EventRecipientStatus } from "../db/schema";

export type EventRecipient = {
    eventId: string;
    userId: string;
    providerMessageId: string | null;
    status: EventRecipientStatus;
    createdAt: Date;
};
