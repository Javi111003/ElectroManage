export interface Register {
  totalConsumption: number;
  totalCost: number;
  registers: [
    {
      registerId: number;
      workCenterId: number;
      consumption: number;
      cost: number;
      registerDate: string;
    }
  ]
}
