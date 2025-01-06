export interface PolicyByCompany {
  id: number;
  name: string;
  applyingDate: string;
  companyId: number;
}

export interface Policy {
  name: string;
  description: string;
}

export interface PolicyInfo {
  id: number;
  name: string;
  description: string;
  applyingDate: string;
}
