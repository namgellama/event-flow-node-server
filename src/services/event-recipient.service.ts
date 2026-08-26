import { AppError } from "../errors/app-error";
import * as eventRecipientRepository from "../repositories/event-recipient.repository";
import * as eventService from "../services/event.service";

export async function create(eventId: string, userId: string) {
    await eventService.getById(eventId);

    const existing = await eventRecipientRepository.getById(eventId, userId);

    if (existing) {
        throw new AppError(409, "User is already a recipient of this event");
    }

    return eventRecipientRepository.create(eventId, userId);
}
