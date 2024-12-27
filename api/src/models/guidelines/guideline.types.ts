import { Types } from "mongoose";

export interface Guideline {
  name: string;
  description: string;
  wordLimit: number;
  dueDate: Date;
  organisation: Types.ObjectId;
  owner: Types.ObjectId;
  isDeleted: boolean;
}
