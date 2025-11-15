import axios from 'axios';
import { BACKEND_BASE_URL } from './baseurl';

const BACKEND_URL = process.env.ADDRESS_VALIDATION_URL;

const axiosInstanceAuthGoogleAddValidate = axios.create({
  baseURL:
    'https://addressvalidation.googleapis.com/v1:validateAddress?key=AIzaSyD0VTtsFXn94ADdKScFyZApO5XfdHzOhnU',
  Accept: 'application/json',
  'Content-Type': 'application/json',
});

axiosInstanceAuthGoogleAddValidate.interceptors.response.use(
  (response) => response,
  (error) => {
    return Promise.reject(error);
  }
);
export default axiosInstanceAuthGoogleAddValidate;
