import axios from 'axios';
import { BACKEND_BASE_URL } from './baseurl';

const BACKEND_URL = BACKEND_BASE_URL;

const axiosInstanceAuthFormData = axios.create({
  baseURL: BACKEND_URL,
  Accept: 'application/json',
  'content-type': 'multipart/form-data',
});

axiosInstanceAuthFormData.interceptors.request.use(
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

axiosInstanceAuthFormData.interceptors.response.use(
  (response) => response,
  (error) => {
    // const { response } = error;

    // if (response && response.status === 500) {
    //   // Handle 500 Internal Server Error
    //   console.error("Internal Server Error:", response);
    //   // You can add your custom error handling logic here
    // }

    return Promise.reject(error);
  }
);

export default axiosInstanceAuthFormData;
