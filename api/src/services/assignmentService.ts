import { ASSIGNMENT_BY_ID, ASSIGNMENTS } from "../lib/constants/routes";
import { axiosInstance } from "./axiosInstance";
export interface CharValue {
  value: string;
  copiedAt: string | null;
  copiedFrom: string | null;
}

interface CreateAssignmentData {
  title: string;
  description: string;
  guideline: string;
}

interface UpdateAssignmentData {
  title?: string;
  description?: string;
  wordCount?: number;
  isSubmitted?: boolean;
  submittedAt?: string | null;
  submission?: CharValue[];
  isDeleted?: boolean;
}

export const fetchAssignments = async (orgId: string, guideline: string | null) => {
  let route = ASSIGNMENTS.replace(':orgId', orgId);

  if (guideline) {
    route += `?guideline=${guideline}`;
  }

  const { data } = await axiosInstance.get(route);
  
  return [...data];
}

export const createAssignment = async ({
  orgId,
  assignmentData,
}: {
  orgId: string | null;
  assignmentData: CreateAssignmentData;
}) => {
  try {
    const { data } = await axiosInstance.post(
      ASSIGNMENTS.replace(':orgId', orgId as string),
      assignmentData
    );

    return data;
  } catch (error) {
    console.error("Error adding assignment:", error);
    throw error;
  }
};

export const updateAssignment = async ({
  orgId,
  assignmentId,
  assignmentData
}: {
  orgId: string, 
  assignmentId: string, 
  assignmentData: UpdateAssignmentData 
}) => {
  try {
    const { data } = await axiosInstance.patch(
      ASSIGNMENT_BY_ID.replace(':orgId', orgId).replace(':assignmentId', assignmentId),
      assignmentData
    );
    
    return data;
  } catch (error) {
    console.error("Error updating assignment:", error);
    throw error;
  }
}
