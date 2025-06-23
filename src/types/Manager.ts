import type { Developer } from "./developer-type/Developer";
import type { User } from "./User";


export interface Manager  extends User {
    developers:Developer[];
}