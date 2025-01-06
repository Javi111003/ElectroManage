import { WorkCenter } from "./workCenter.interface";

export interface CentersCreatedPerYear {
  createdComapniesThisYear:number;
  existingCompaniesThisYear:number;
  deletedCompaniesThisYear:number;
}
export interface MostConsumingCenters{
  companyId:number;
  totalConsumption:number ;
}
export interface BiggestCenters{
  companyId:number,
  companyName:string,
  officeCount:number
}
export interface MostWarnedCenters{
  company: WorkCenter;
  countWarning:number;
}
