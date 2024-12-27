import { Types } from "mongoose";

export interface Site {
  url: string;
  launchCount: number;
  favicon: string;
  organisation: Types.ObjectId;
  owner: Types.ObjectId;
}
