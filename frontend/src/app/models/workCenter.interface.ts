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

export interface ManagementTeam {
  name: string | null;
  userIds: number[];
}
