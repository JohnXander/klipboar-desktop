import axios, { type AxiosInstance } from 'axios';
import { LOGIN, REGISTER } from '../lib/constants/routes';

export const axiosInstance: AxiosInstance = axios.create({
  baseURL: 'http://127.0.0.1:8080/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

axiosInstance.interceptors.request.use(
  (config) => {
    if (config.url === LOGIN || config.url === REGISTER) {
      return config;
    }

    const token = localStorage.getItem('token');

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    } else {
      return Promise.reject(new Error('No authentication token found.'));
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);
