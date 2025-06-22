import axios from 'axios';
import { getCookie } from '../helpers/getCookie';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8880/api/v1',
  withCredentials: true
});

axiosInstance.interceptors.request.use((config) => {
    const csrfToken = getCookie("XSRF-TOKEN");
    if (csrfToken) {
        config.headers["X-XSRF-TOKEN"] = csrfToken;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export const BASE_URL = axiosInstance.defaults.baseURL;
export default axiosInstance;
