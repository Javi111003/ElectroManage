import { Credential, UserLogged } from './../../models/credential.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private authURL = API_URL + '/v1/login';

  constructor(private http: HttpClient) { }

  /**
   * Attempts to log in with the provided username and password.
   *
   * @param credentials The credentials to attempt to log in with.
   * @returns True if the login is successful, false otherwise.
   */
  login(credentials: Credential): Observable<any> {
    return this.http.post<any>(this.authURL, credentials);
  }

  /**
   * Checks if the user is currently logged in.
   *
   * @returns True if the user is logged in, false otherwise.
   */
  isLoggedIn(): boolean {
    return sessionStorage.getItem('isAuthenticated') === 'true';
  }

  getUserRoles(): string[] {
    const user: UserLogged = JSON.parse(sessionStorage.getItem('userLogged') || '{}');
    return user.roles
  }

  /**
   * Logs the user out.
   */
  logout(): void {
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('expiration');
    sessionStorage.removeItem('isAuthenticated');
    sessionStorage.removeItem('userLogged');
  }
}
