import axios from 'axios';
import { BACKEND_BASE_URL } from './baseurl';

const BACKEND_URL = BACKEND_BASE_URL;

const axiosInstanceAuth = axios.create({
  baseURL: BACKEND_URL,
  Accept: 'application/json',
  'Content-Type': 'application/json',
});

axiosInstanceAuth.interceptors.request.use(
  async (config) => {
    const authToken = localStorage.getItem('auth_token');
    if (authToken) {
      config.headers = {
        Authorization: `Bearer ${authToken}`,
      };
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

axiosInstanceAuth.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  } 
);
export default axiosInstanceAuth;
