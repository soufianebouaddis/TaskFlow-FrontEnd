import type { Developer } from "./Developer";
import type { User } from "./User";


export interface Manager  extends User {
    developers:Developer[];
}