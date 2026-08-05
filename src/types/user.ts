import { Role } from "../db/schema";

export type User = {
    id: string;
    email: string;
    name: string;
    password: string;
    role: Role;
    createdAt: Date;
    updatedAt: Date;
};
