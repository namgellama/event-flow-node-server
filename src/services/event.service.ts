import { env } from "../config/env";
import { AppError } from "../errors/app-error";
import { scheduleEvent } from "../queues/event.queue";
import * as eventRepository from "../repositories/event.repository";
import { CreateEventInput, UpdateEventInput } from "../schemas/event.schema";
import * as emailTemplateService from "../services/email-template.service";
import { Event, PaginatedEvent } from "../types/event";

export async function getAll(
    page: number,
    pageSize: number,
): Promise<PaginatedEvent> {
    const offset = (page - 1) * pageSize;

    const [events, total] = await Promise.all([
        eventRepository.getAll(pageSize, offset),
        eventRepository.getCount(),
    ]);

    return {
        events,
        pagination: {
            page,
            pageSize,
            total,
            totalPages: Math.ceil(total / pageSize),
        },
    };
}

export async function findById(eventId: string): Promise<Event> {
    const event = await eventRepository.findById(eventId);

    if (!event) {
        throw new AppError(404, "Event not found");
    }

    return event;
}

export async function create(body: CreateEventInput): Promise<Event> {
    if (body.emailTemplateId) {
        await emailTemplateService.findById(body.emailTemplateId);
    }

    const delay = body.scheduledAt.getTime() - Date.now();

    if (env.NODE_ENV !== "development" && delay < 0) {
        throw new AppError(400, "Scheduled time must be in the future");
    }

    const event = await eventRepository.create(body);

    if (event.emailTemplateId) {
        const queueDelay =
            env.NODE_ENV === "development" ? env.EVENT_QUEUE_DELAY : delay;

        await scheduleEvent(event.id, queueDelay);
    }

    return event;
}

export async function update(
    eventId: string,
    body: UpdateEventInput,
): Promise<Event> {
    await findById(eventId);

    if (body.emailTemplateId) {
        await emailTemplateService.findById(body.emailTemplateId);
    }

    return eventRepository.update(eventId, body);
}

export async function remove(eventId: string): Promise<void> {
    await findById(eventId);

    eventRepository.remove(eventId);
}
