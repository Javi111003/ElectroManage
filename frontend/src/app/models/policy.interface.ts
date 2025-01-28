import { TotalConsumptionData } from "./register.interface";

// Policy info for POST and PUT
export interface Policy {
  name: string;
  description: string;
}

// Policy info to be listed
export interface PolicyInfo {
  policyId: number;
  policyName: string;
  description: string;
}

// Policy applied to a work center
export interface PolicyApplied {
  efficiencyPolicy: PolicyInfo;
  applyingDate: string;
  to: string;
}

// Info of a policy before and after its application
export interface PolicyComparison {
  before: TotalConsumptionData;
  after: TotalConsumptionData;
}
