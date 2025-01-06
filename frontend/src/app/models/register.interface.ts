export interface RegisterTotalConsumption {
  totalConsumption: number;
  totalCost: number;
  registers: RegisterDailyConsumption[];
}

export interface RegisterDailyConsumption {
  registerId: number;
  workCenterId: number;
  consumption: number;
  cost: number;
  registerDate: string;
}

export interface RegisterYearlyConsumption {
  year: number;
  meanCost: number;
  meanConsumption: number
}

export interface AvgRegisterConsumption {
  companyID: number;
  yearCostDto: RegisterYearlyConsumption[]
}
