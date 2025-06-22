
import type { User } from "../User";



export interface DeveloperResponse {
    timeStamp?: number;
    status?: number;
    error?: string;
    success?: boolean;
    message?: string;
    data: Developer[];
    headers?: string;
}





export interface Developer extends User {
    developerType: string;
}