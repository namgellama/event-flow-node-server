import * as eventRepository from "../repositories/event.repository";
import { CreateEventInput } from "../schemas/event.schema";

export async function create(body: CreateEventInput) {
    return eventRepository.create(body);
}
