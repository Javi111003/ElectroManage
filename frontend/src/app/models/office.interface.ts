import { WorkCenter } from "./workCenter.interface";

export interface OfficeInfo {
  id: number;
  name: string;
  description: string | null;
  company: WorkCenter;
}

export interface Office {
  companyId: number;
  name: string;
  description: string | null;
}
