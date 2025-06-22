import axiosInstance, { BASE_URL } from "../../axios/axiosInstance";



const addDeveloperToTeam = async (managerId: number, developerId: number): Promise<void> => {
    await axiosInstance.post<void>(`${BASE_URL}/manager/${managerId}/${developerId}`);
}

const assignedTaskToDeveloper = async (taskId: number, developerId: number): Promise<void> => {
    await axiosInstance.post<void>(`${BASE_URL}/manager/${taskId}/${developerId}`);
}   

export const managerService = {
    addDeveloperToTeam,
    assignedTaskToDeveloper
};