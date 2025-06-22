

export interface RegisterRequest{
    firstName:string;
    lastName:string;
    email:string;
    password:string;
    role:string;
    developerType?:string | null; 
}