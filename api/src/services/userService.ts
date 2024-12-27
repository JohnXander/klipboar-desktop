import { LOGIN, REGISTER, USERS } from "../lib/constants/routes";
import { axiosInstance } from "./axiosInstance";
import axios from 'axios';

interface Login {
  email: string;
  password: string;
}

interface Register {
  name: string;
  email: string;
  password: string;
  role: string;
}

export const fetchUsers = async (orgId: string) => {
  const { data } = await axiosInstance.get(USERS.replace(':orgId', orgId));
  
  return [...data];
}

export const loginUser = async ({ email, password }: Login) => {
  try {
    const { data } = await axiosInstance.post(LOGIN, { email, password });
    
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.error || 'An error occurred');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
}

export const registerUser = async ({ name, email, password, role }: Register) => {
  try {
    const { data } = await axiosInstance.post(REGISTER, { name, email, password, role });

    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.error || 'An error occurred');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
}
