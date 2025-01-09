export interface WorkCenter {
  id: number;
  name: string;
}

export interface AdminArea {
  name: string;
  description: string | null;
}

export interface InstallationType {
  name: string;
  description: string | null;
}

export interface CenterPropertyInfo {
  id: number;
  name: string;
  description: string;
}

export interface ManagementTeam {
  name: string | null;
  userIds: number[];
}

export interface Location {
  addressDetails: string;
  coordenate: {
    latitude: number;
    longitude: number;
  }
}

export interface CenterDetails {
  id: number;
  name: string;
  consumptionLimit: number;
  installationType: CenterPropertyInfo;
  administrativeArea: CenterPropertyInfo;
  location: {
    id: number;
    addressDetails: string;
    coordenateDTO: {
      latitude: number;
      longitude: number;
    }
  },
  status: string;
  managementTeam: {
    id: number;
    teamName: string;
    companyId: number;
    members: [
      {
        userId: number;
        userName: string;
      }
    ]
  }
}
