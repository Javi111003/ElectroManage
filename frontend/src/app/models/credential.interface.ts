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

// User logged info
export interface UserLogged {
  id: number;
  email: string;
  username: string;
  company: WorkCenter;
  roles: string[];
}

// User data to register
export interface RegisterUser {
  email: string;
  username: string;
  password: string;
  roles: string[];
  companyId: number;
}

// User info to PUT
export interface EditedUser {
  username: string;
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
