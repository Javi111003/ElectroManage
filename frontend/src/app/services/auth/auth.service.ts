import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private isAuthenticated = false;

  constructor() {
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
  login(username: string, password: string): boolean {
    if (username === 'user' && password === 'password') {
      this.isAuthenticated = true;
      sessionStorage.setItem('isAuthenticated', 'true');
      return true;
    }
    return false;
  }

  /**
   * Checks if the user is currently logged in.
   *
   * @returns True if the user is logged in, false otherwise.
   */
  isLoggedIn(): boolean {
    console.log(this.isAuthenticated);
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
