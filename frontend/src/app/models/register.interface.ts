// Total consumption data of a center in a period
export interface TotalConsumptionData {
  totalConsumption: number;
  totalCost: number;
  registers: RegisterByDay[];
}

// Consumption register of an specific day
export interface RegisterByDay {
  registerId: number;
  workCenterId: number;
  consumption: number;
  cost: number;
  registerDate: string;
}

// Mean data of a center in an specific year
export interface MeanDataByYear {
  year: number;
  meanCost: number;
  meanConsumption: number
}

// Mean data of a center in the last three years
export interface MeanRegisterData {
  companyID: number;
  yearCostDto: MeanDataByYear[]
}

// Register to POST
export interface Register {
  companyId: number;
  consumption: number;
  date: string;
}
