import { env } from "../config/env";
import { AppError } from "../errors/app-error";
import { scheduleEvent } from "../queues/event.queue";
import * as eventRepository from "../repositories/event.repository";
import { CreateEventInput, UpdateEventInput } from "../schemas/event.schema";
import * as emailTemplateService from "../services/email-template.service";

export async function getAll(page: number, pageSize: number) {
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

export async function getById(id: string) {
    const event = await eventRepository.getById(id);

    if (!event) {
        throw new AppError(404, "Event not found");
    }

    return event;
}

export async function create(body: CreateEventInput) {
    if (body.emailTemplateId) {
        await emailTemplateService.getById(body.emailTemplateId);
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

export async function update(id: string, body: UpdateEventInput) {
    await getById(id);

    if (body.emailTemplateId) {
        await emailTemplateService.getById(body.emailTemplateId);
    }

    return eventRepository.update(id, body);
}

export async function remove(id: string) {
    await getById(id);

    eventRepository.remove(id);
}
