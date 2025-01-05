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
