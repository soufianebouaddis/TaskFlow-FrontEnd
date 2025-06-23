import axiosInstance, { BASE_URL } from "../../axios/axiosInstance";

const addDeveloperToTeam = async (managerId: string, developerId: string): Promise<void> => {
    await axiosInstance.post<void>(`${BASE_URL}/manager/team/${managerId}/${developerId}`);
}

const assignedTaskToDeveloper = async (taskId: number, developerId: string): Promise<void> => {
    await axiosInstance.post<void>(`${BASE_URL}/manager/${taskId}/${developerId}`);
}   

export const managerService = {
    addDeveloperToTeam,
    assignedTaskToDeveloper
};