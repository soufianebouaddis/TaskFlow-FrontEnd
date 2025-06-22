import type { Task } from "./task-type/Task";
import type { User } from "./task-type/User";

export interface Developer extends User {
    tasks: Task[];
}