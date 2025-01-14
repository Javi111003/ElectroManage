import { WorkCenter } from "./workCenter.interface";

// Credentials to login
export interface Credential {
  email: string;
  password: string;
}

// User auth token
export interface AccessToken {
  token: string;
  expiration: string;
}

// User logged info + roles
export interface UserLogged {
  info: UserInfo;
  roles: string[];
}

// User info
export interface UserInfo {
  id: number;
  email: string;
  company: WorkCenter;
}

// User data to register
export interface RegisterUser {
  email: string;
  username: string;
  password: string;
  roles: string[];
  companyId: number;
}

// Info of an specific user
export interface UserById {
  email: string;
  username: string;
  company: WorkCenter;
  roles: string[];
}
