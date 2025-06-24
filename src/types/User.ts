import type { Task } from "./task-type/Task";

export interface User{
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    role: string;
}

export interface ExtendedUser {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    createdAt: Date;
    updatedAt: Date;
    role: string;
    developerDetails?: {
      team?: Array<{
        id: string;
        firstName: string;
        lastName: string;
        email: string;
        developerType: string;
      }>;
      tasks?: Task[];
    };
  }