

export interface LoginResponse {
    timeStamp?:number;
    status?:number;
    error?:string;
    success?:boolean;
    message?:string;
    data?: string;
    headers?:string;
}