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

// Team info for POST
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

// Location info for POST and PUT
export interface Location {
  addressDetails: string;
  coordenate: {
    latitude: number;
    longitude: number;
  }
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
  location: LocationInfo,
  status: string;
  managementTeam: ManagementTeamInfo;
}
