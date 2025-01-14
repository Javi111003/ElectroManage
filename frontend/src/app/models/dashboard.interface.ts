import { WorkCenter } from "./workCenter.interface";

// Number of centers of a year, number of created and deleted
export interface CentersPerYear {
  createdComapniesThisYear: number;
  existingCompaniesThisYear: number;
  deletedCompaniesThisYear: number;
}

// Center on the most consuming list
export interface MostConsumingCenter {
  companyId: number;
  companyName: string;
  consumptionLimit: 0;
  totalConsumption: number ;
}

// Center on the most offices list
export interface BiggestCenter {
  companyId: number;
  companyName: string;
  officeCount: number;
}

// Center on the most warned list
export interface MostWarnedCenter {
  company: WorkCenter;
  countWarning: number;
}
