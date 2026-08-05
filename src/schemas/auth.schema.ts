import { z } from "zod";

export const registerSchema = z.object({
    name: z.string().min(1, "Name is required"),
    email: z.email(),
    password: z.string().min(5, "Password must be at least 5 characters long"),
});

export const loginSchema = z.object({
    email: z.email(),
    password: z.string().nonempty("Password is required"),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
