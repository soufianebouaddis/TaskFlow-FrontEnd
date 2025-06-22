import type { AxiosResponse } from "axios";
import type { LoginRequest } from "../../types/LoginRequest";
import axiosInstance, { BASE_URL } from "../../axios/axiosInstance";
import type { LoginResponse } from "../../types/respones/LoginResponse";
import type { RegisterRequest } from "../../types/RegisterRequest";
import type { RegisterResponse } from "../../types/respones/RegisterResponse";

const register = (registerRequest: RegisterRequest): Promise<AxiosResponse<RegisterResponse>> => {
    return axiosInstance.post<RegisterResponse>(`${BASE_URL}/auth/register`, registerRequest);
};

const login = (loginRequest: LoginRequest): Promise<AxiosResponse<LoginResponse>> => {
    return axiosInstance.post<LoginResponse>(`${BASE_URL}/auth/login`, loginRequest);
};
const profile = (): Promise<AxiosResponse<any>> => {
    return axiosInstance.get<any>(`${BASE_URL}/auth/profile`);
};
const logout = (): Promise<AxiosResponse<void>> => {
    return axiosInstance.post(`${BASE_URL}/auth/logout`, {});
};

const authService = {
    login,
    register,
    logout,
    profile

};

export default authService;