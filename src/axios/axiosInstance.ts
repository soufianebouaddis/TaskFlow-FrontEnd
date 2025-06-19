import axios from 'axios';

const axiosInstance = axios.create({
  baseURL: 'http://localhost:8880/api/v1/auth/',
  withCredentials: true
});

export default axiosInstance;
