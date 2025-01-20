// Center policy info to be listed
export interface PolicyByCompany {
  id: number;
  name: string;
  applyingDate: string;
  companyId: number;
}

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
