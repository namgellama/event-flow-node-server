import { AppError } from "../errors/app-error";
import * as eventRecipientRepository from "../repositories/event-recipient.repository";
import * as eventService from "../services/event.service";
import { EventRecipient } from "../types/event-recipient";

export async function create(
    eventId: string,
    userId: string,
): Promise<EventRecipient> {
    await eventService.findById(eventId);

    const existing = await eventRecipientRepository.findByEventAndUser(
        eventId,
        userId,
    );

    if (existing) {
        throw new AppError(409, "User is already a recipient of this event");
    }

    return eventRecipientRepository.create(eventId, userId);
}
