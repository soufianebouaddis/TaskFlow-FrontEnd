export interface Task{
    id:number;
    taskLabel:string;
    taskState:string;
    createdAt:Date;
    updatedAt:Date;
}

export interface UpdateRequest {
    taskLabel?: string;
    taskState?: string;
}


export interface TaskResponse {
    timeStamp?: number;
    status?: number;
    error?: string;
    success?: boolean;
    message?: string;
    data: Task;
    headers?: string;
}

export interface TaskListResponse {
    timeStamp?: number;
    status?: number;
    error?: string;
    success?: boolean;
    message?: string;
    data: Task[];
    headers?: string;
}


export interface TaskRequest {
    taskLabel: string;
    taskState: string;
}

