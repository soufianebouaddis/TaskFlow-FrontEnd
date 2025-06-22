import type { AxiosResponse } from "axios";
import axiosInstance, { BASE_URL } from "../../axios/axiosInstance";
import type { DeveloperResponse } from "../../types/developer-type/Developer";

const developers = async () :  Promise<AxiosResponse<DeveloperResponse>> => {
    return axiosInstance.get<DeveloperResponse>(`${BASE_URL}/developers`);
};

export const developerService = {
    developers  
};