import { GUIDELINE_BY_ID, GUIDELINES } from "../lib/constants/routes";
import { axiosInstance } from "./axiosInstance";
import axios from 'axios';

interface CreateGuidelineData {
  name: string;
  description: string;
  wordLimit: string;
  dueDate: string;
}

interface UpdateGuidelineData {
  name?: string;
  description?: string;
  wordLimit?: string;
  dueDate?: string;
  isDeleted?: boolean;
}

export const createGuideline = async ({
  orgId,
  guidelineData
}: {
  orgId: string,
  guidelineData: CreateGuidelineData
}) => {
  try {
    const { data } = await axiosInstance.post(
      GUIDELINES.replace(':orgId', orgId),
      guidelineData
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

export const fetchGuidelines = async (orgId: string) => {
  const { data } = await axiosInstance.get(GUIDELINES.replace(':orgId', orgId));
  
  return [...data];
}

export const updateGuideline = async ({
  orgId,
  guidelineId,
  guidelineData
}: {
  orgId: string, 
  guidelineId: string, 
  guidelineData: UpdateGuidelineData 
}) => {
  try {
    const { data } = await axiosInstance.patch(
      GUIDELINE_BY_ID.replace(':orgId', orgId).replace(':guidelineId', guidelineId),
      guidelineData
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
