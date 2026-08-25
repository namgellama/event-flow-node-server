import { AppError } from "../errors/app-error";
import * as eventRepository from "../repositories/event.repository";
import { CreateEventInput, UpdateEventInput } from "../schemas/event.schema";

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
    return eventRepository.create(body);
}

export async function update(id: string, body: UpdateEventInput) {
    const event = await eventRepository.getById(id);

    if (!event) {
        throw new AppError(404, "Event not found");
    }

    return eventRepository.update(id, body);
}
