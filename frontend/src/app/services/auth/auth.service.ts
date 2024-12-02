import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private loggedIn = false;

  /**
   * Attempts to log in with the provided username and password.
   *
   * @param username The username to attempt to log in with.
   * @param password The password to attempt to log in with.
   * @returns True if the login is successful, false otherwise.
   */
  login(username: string, password: string): boolean {
    if (username === 'user' && password === 'password') {
      this.loggedIn = true;
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
    return this.loggedIn;
  }

  /**
   * Logs the user out.
   */
  logout(): void {
    this.loggedIn = false;
  }
}
