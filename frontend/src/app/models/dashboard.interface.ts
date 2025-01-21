import { WorkCenter } from "./workCenter.interface";

// Number of centers of a year, number of created and deleted
export interface CentersPerYear {
  year: number;
  createdComapniesThisYear: number;
  existingCompaniesThisYear: number;
  deletedCompaniesThisYear: number;
  companiesByMonth: CompanybyMonthData[];
}
export interface CompanybyMonthData {
  month: number;
  countCreatedCompanies: number;
  countDeletedCompanies: number;
}

// Center on the most consuming list
export interface MostConsumingCenter {
  companyId: number;
  companyName: string;
  consumptionLimit: number;
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
  countWarningByMonth: WarningByMonth[];
}
export interface WarningByMonth {
  month: number;
  countWarning: number;
}
