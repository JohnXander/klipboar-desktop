import { ORGANISATIONS } from "../lib/constants/routes";
import { axiosInstance } from "./axiosInstance";
import axios from 'axios';

interface Organisation {
  name: string;
}

interface UpdateOrgParams {
  orgId: string;
  action: string;
  email?: string;
}

export const fetchOrganisations = async () => {
  const { data } = await axiosInstance.get(ORGANISATIONS);
  
  return data;
}

export const createOrganisation = async ({ name }: Organisation) => {
  try {
    const { data } = await axiosInstance.post(ORGANISATIONS, { name });
    
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.error || 'An error occurred');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
}

export const updateOrganisation = async ({ orgId, action, email }: UpdateOrgParams) => {
  try {
    const { data } = await axiosInstance.patch(
      `${ORGANISATIONS}/${orgId}?action=${action}`,
      { email }
    );
    
    return data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      throw new Error(error.response?.data.error || 'An error occurred');
    } else {
      throw new Error('An unexpected error occurred');
    }
  }
}
