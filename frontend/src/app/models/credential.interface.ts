import { WorkCenter } from "./workCenter.interface";

export interface Credential {
  email: string;
  password: string;
}

export interface AccessToken {
  token: string;
  expiration: string;
}

export interface UserLogged {
  info: UserInfo;
  roles: string[];
}

export interface UserInfo {
  id: number;
  email: string;
  company: WorkCenter;
}

export interface RegisterUser {
  email: string;
  username: string;
  password: string;
  roles: string[];
  companyId: number;
}

export interface UserById {
  email: string;
  username: string;
  company: WorkCenter;
  roles: string[];
}
