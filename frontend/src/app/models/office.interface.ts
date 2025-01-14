import { WorkCenter } from "./workCenter.interface";

// Office info to be listed
export interface OfficeInfo {
  id: number;
  name: string;
  description: string | null;
  company: WorkCenter;
}

// Office info for POST and PUT
export interface Office {
  companyId: number;
  name: string;
  description: string | null;
}
