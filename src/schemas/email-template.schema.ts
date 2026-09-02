import { z } from "zod";

export const createEmailTemplateSchema = z.object({
    name: z.string().nonempty("Name is required").max(255, "Name must not exceed 255 characters"),
    sender: z
        .string()
        .nonempty("Sender is required")
        .max(255, "Name must not exceed 255 characters"),
    subject: z
        .string()
        .nonempty("Sender is required")
        .max(500, "Name must not exceed 500 characters"),
    html: z.string().nonempty("Sender is required"),
    isReusable: z.boolean().default(true),
});

export type CreateEmailTemplateInput = z.infer<typeof createEmailTemplateSchema>;

export const updateEmailTemplateSchema = createEmailTemplateSchema.partial();

export type UpdateEmailTemplateInput = z.infer<typeof updateEmailTemplateSchema>;
