import { WorkCenter } from "./workCenter.interface";

// Info of each alert of a center
export interface AlertData {
  month: number;
  year: number;
  establishedLimit: number;
  consumption: number;
}

// Alerts of an specific center
export interface Alert {
  companyID: number;
  companyName: string;
  warnings: AlertData[];
}

// Excess of a specific month and year
export interface Excess {
  company: WorkCenter;
  limit: number;
  consumption: number;
  exceeded: number;
}
