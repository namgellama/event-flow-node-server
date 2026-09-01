import bcrypt from "bcryptjs";
import { Response } from "express";
import ms from "ms";
import { env } from "../config/env";
import { AppError } from "../errors/app-error";
import * as userRepository from "../repositories/user.repository";
import { LoginInput, RegisterInput } from "../schemas/auth.schema";
import { User } from "../types/user";
import { signToken, verifyToken } from "../utils/jwt";

export async function register(
    body: RegisterInput,
): Promise<Omit<User, "password">> {
    const existing = await userRepository.findByEmail(body.email);

    if (existing) {
        throw new AppError(409, "Email already exists");
    }

    const hashedPassword = await bcrypt.hash(body.password, 10);

    return userRepository.create({
        ...body,
        password: hashedPassword,
        role: "USER",
    });
}

export async function login(
    res: Response,
    body: LoginInput,
): Promise<{ accessToken: string; refreshToken: string }> {
    const existing = await userRepository.findByEmail(body.email);

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

export async function logout(res: Response): Promise<void> {
    res.clearCookie("refreshToken");
}

export async function refreshToken(token: string): Promise<string> {
    const payload = verifyToken(token, env.JWT_REFRESH_SECRET);

    const user = await userRepository.findById(payload.sub);

    if (!user) {
        throw new AppError(401, "User not found");
    }

    return signToken(
        { sub: user.id, role: user.role },
        env.JWT_ACCESS_SECRET,
        env.JWT_ACCESS_EXPIRY,
    );
}

export async function getMe(userId: string): Promise<User> {
    const user = await userRepository.findById(userId);

    if (!user) {
        throw new AppError(404, "User not found");
    }

    return user;
}
