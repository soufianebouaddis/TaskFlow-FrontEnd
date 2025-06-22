import type { Role } from "../Role";

export interface User{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    role: Role;
}