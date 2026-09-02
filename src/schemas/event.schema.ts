import { z } from "zod";

export const createEventSchema = z.object({
    name: z.string().nonempty("Name is required"),
    description: z.string().min(3, "Description must be at least 3 characters long"),
    context: z.record(z.string(), z.unknown()).nullable(),
    emailTemplateId: z.uuid().nullable(),
    scheduledAt: z.coerce.date(),
});

export type CreateEventInput = z.infer<typeof createEventSchema>;

export const updateEventSchema = createEventSchema
    .extend({
        status: z.enum(["SCHEDULED", "PROCESSING", "COMPLETED", "CANCELLED", "FAILED"]),
    })
    .partial();

export type UpdateEventInput = z.infer<typeof updateEventSchema>;
