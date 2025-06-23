import type { AxiosResponse } from "axios";
import type { Task, TaskRequest, TaskResponse, UpdateRequest } from "../../types/task-type/Task";
import axiosInstance, { BASE_URL } from "../../axios/axiosInstance";


const add = async (task: TaskRequest) :  Promise<AxiosResponse<TaskResponse>> => {
    return axiosInstance.post<TaskResponse>(`${BASE_URL}/tasks`, task);
};

const update = async (taskId:number,task: UpdateRequest) :  Promise<AxiosResponse<TaskResponse>> => {
    return axiosInstance.put<TaskResponse>(`${BASE_URL}/tasks/${taskId}`, task);
};
const tasks = async () :  Promise<AxiosResponse<TaskResponse>> => {
    return axiosInstance.get<TaskResponse>(`${BASE_URL}/tasks`);
};

const deleteTask = async (taskId:number) :  Promise<AxiosResponse<void>> => {
    return axiosInstance.delete<void>(`${BASE_URL}/tasks/${taskId}`);
}

export const taskService = {
   add,
   update,
   tasks,
   deleteTask
};