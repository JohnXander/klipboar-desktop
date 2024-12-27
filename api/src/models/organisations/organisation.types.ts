import { Types } from "mongoose";

export interface OrganisationMembers {
  user: string;
  role: string;
}

export interface Organisation {
  _id?: Types.ObjectId;
  name: string;
  owner: Types.ObjectId;
  members: OrganisationMembers[];
  logoUrl?: string;
}
