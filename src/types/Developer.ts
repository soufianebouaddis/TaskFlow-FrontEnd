import type { Task } from "./Task";
import type { User } from "./User";

export interface Developer extends User {
    tasks: Task[];
}