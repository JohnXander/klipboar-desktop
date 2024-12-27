import { Types } from "mongoose";

export interface AssignmentSubmission {
  value: string;
  copiedAt: string | null;
  copiedFrom: string | null;
}

export interface Assignment {
  title: string;
  description: string;
  guideline: Types.ObjectId;
  wordCount: number;
  submittedBy: Types.ObjectId;
  submittedTo: Types.ObjectId;
  organisation: Types.ObjectId;
  isSubmitted: boolean;
  submittedAt: Date;
  submission: AssignmentSubmission[];
  isDeleted: boolean;
}
