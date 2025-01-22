import { PolicyApplied, PolicyInfo } from "./policy.interface";

// Commonly required info of when listing centers
export interface WorkCenter {
  id: number;
  name: string;
}

// Administrative area info for POST
export interface AdminArea {
  name: string;
  description: string | null;
}

// Installation type info for POST
export interface InstallationType {
  name: string;
  description: string | null;
}

// Types and areas info to be listed
export interface CenterPropertyInfo {
  id: number;
  name: string;
  description: string;
}

// Team info for POST and PUT
export interface ManagementTeam {
  name: string | null;
  userIds: number[];
}

// Team info needed when listing centers in detail
export interface ManagementTeamInfo {
  id: number;
  teamName: string;
  companyId: number;
  members: TeamMember[];
}

// Team member info
export interface TeamMember {
  userId: number;
  userName: string;
}

// Location info for POST
export interface Location {
  addressDetails: string;
  coordenate: {
    latitude: number;
    longitude: number;
  }
}

// Location info for PUT
export interface LocationEdited {
  addressDetails: string;
  latitude: number;
  longitude: number;
}

// Location info needed when listing centers in detail
export interface LocationInfo {
  id: number;
  addressDetails: string;
  coordenateDTO: Coordinates;
}

// Location coordinates
export interface Coordinates {
  latitude: number;
  longitude: number;
}

// Center info to be listed when more details are needed
export interface CenterDetails {
  id: number;
  name: string;
  consumptionLimit: number;
  installationType: CenterPropertyInfo;
  administrativeArea: CenterPropertyInfo;
  location: LocationInfo;
  currentEfficiencyPolicy: PolicyApplied;
  status: string;
  managementTeam: ManagementTeamInfo;
  currentCostFormula: CurrentFormula;
}

// Formula info for POST
export interface Formula {
  companyId: number;
  name: string;
  expression: string;
  variables: Variable[];
}

// Formula of a specific center
export interface CurrentFormula {
  id: number;
  name: string;
  expression: string;
  variables: Variable[];
}

// Formula info to PUT
export interface FormulaInfo {
  formulaId: number;
  companyId: number;
  name: string;
  expression: string;
  variables: Variable[];
}

// Formula variables
export interface Variable {
  variableName: string;
  expression: string;
}

// Center info to POST
export interface WorkCenterData {
  name: string;
  areaId: number;
  installationTypeId: number;
  locationId: number;
  managementTeamId: number;
  efficiencyPolicyId: number;
  consumptionLimit: number;
}
