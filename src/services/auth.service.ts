import bcrypt from "bcryptjs";
import { AppError } from "../errors/app-error";
import * as usersRepository from "../repositories/user.repository";
import { RegisterInput } from "../schemas/auth.schema";

export async function register(body: RegisterInput) {
    const existing = await usersRepository.findByEmail(body.email);

    if (existing) {
        throw new AppError(409, "Email already exists");
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    return await usersRepository.create({
        ...body,
        password: hashedPassword,
        role: "USER",
    });
}
