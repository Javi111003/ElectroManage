export interface AlertData {
  month: number;
  year: number;
  establishedLimit: number;
  consumption: number;
}

export interface Alert {
  companyID: number;
  warnings: AlertData[];
}
