import bcrypt from "bcryptjs";
import { Response } from "express";
import ms from "ms";
import { env } from "../config/env";
import { AppError } from "../errors/app-error";
import * as usersRepository from "../repositories/user.repository";
import { LoginInput, RegisterInput } from "../schemas/auth.schema";
import { signToken, verifyToken } from "../utils/jwt";

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

export async function login(res: Response, body: LoginInput) {
    const existing = await usersRepository.findByEmail(body.email);

    if (!existing) {
        throw new AppError(401, "Invalid email or password");
    }
    const isMatch = await bcrypt.compare(body.password, existing.password);

    if (!isMatch) {
        throw new AppError(401, "Invalid email or password");
    }

    const accessToken = signToken(
        { sub: existing.id, role: existing.role },
        env.JWT_ACCESS_SECRET,
        env.JWT_ACCESS_EXPIRY,
    );

    const refreshToken = signToken(
        { sub: existing.id, role: existing.role },
        env.JWT_REFRESH_SECRET,
        env.JWT_REFRESH_EXPIRY,
    );

    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: env.NODE_ENV === "production",
        sameSite: "lax",
        maxAge: ms(env.JWT_REFRESH_EXPIRY as ms.StringValue),
    });

    return { accessToken, refreshToken };
}

export async function logout(res: Response) {
    res.clearCookie("refreshToken");
}

export async function refreshToken(token: string) {
    const payload = verifyToken(token, env.JWT_REFRESH_SECRET);

    const user = await usersRepository.findById(payload.sub);

    if (!user) {
        throw new AppError(401, "User not found");
    }

    return signToken(
        { sub: user.id, role: user.role },
        env.JWT_ACCESS_SECRET,
        env.JWT_ACCESS_EXPIRY,
    );
}
