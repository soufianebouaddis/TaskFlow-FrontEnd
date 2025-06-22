import type { Developer } from "./Developer";
import type { User } from "./task-type/User";


export interface Manager  extends User {
    developers:Developer[];
}