import { Credential, UserLogged } from './../../models/credential.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API_URL } from '../../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;
  private authURL = API_URL + '/v1/login';

  constructor(private http: HttpClient) {
    // Check local storage for authentication status
    this.isAuthenticated = sessionStorage.getItem('isAuthenticated') === 'true';
  }

  /**
   * Attempts to log in with the provided username and password.
   *
   * @param username The username to attempt to log in with.
   * @param password The password to attempt to log in with.
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
    return this.isAuthenticated;
  }

  /**
   * Logs the user out.
   */
  logout(): void {
    this.isAuthenticated = false;
    sessionStorage.removeItem('isAuthenticated');
  }
}
