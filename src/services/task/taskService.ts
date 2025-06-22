import type { AxiosResponse } from "axios";
import type { Task, TaskRequest, TaskResponse } from "../../types/task-type/Task";
import axiosInstance, { BASE_URL } from "../../axios/axiosInstance";


const add = async (task: TaskRequest) :  Promise<AxiosResponse<TaskResponse>> => {
    return axiosInstance.post<TaskResponse>(`${BASE_URL}/tasks`, task);
};

const update = async (taskId:number,task: Task) :  Promise<AxiosResponse<TaskResponse>> => {
    return axiosInstance.post<TaskResponse>(`${BASE_URL}/tasks/${taskId}`, task);
};
const tasks = async () :  Promise<AxiosResponse<TaskResponse>> => {
    return axiosInstance.get<TaskResponse>(`${BASE_URL}/tasks`);
};

export const taskService = {
   add,
   update,
   tasks

};