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
