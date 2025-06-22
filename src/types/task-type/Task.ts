export interface Task{
    id:number;
    taskLabel:string;
    taskState:string;
    createdAt:Date;
    updatedAt:Date;
}



export interface TaskResponse {
    timeStamp?: number;
    status?: number;
    error?: string;
    success?: boolean;
    message?: string;
    data: any;
    headers?: string;
}


export interface TaskRequest {
    taskLabel: string;
    taskState: string;
}

