import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8880/api/v1',
  withCredentials: true
});
export const BASE_URL = axiosInstance.defaults.baseURL;
export default axiosInstance;
