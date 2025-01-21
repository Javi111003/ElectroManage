import { Injectable } from '@angular/core';
import { API_URL } from '../../config/api.config';
import { EditedUser, RegisterUser, UserById } from '../../models/credential.interface';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  constructor(private http: HttpClient) { }

  /**
   * Fetches the list of users from the API.
   * This method sends an HTTP GET request to the API to retrieve a list of users.
   * @returns An Observable that resolves to an array of UserInfo objects.
   */
  getUsersList(): Observable<any> {
    return this.http.get<any>(API_URL + '/v1/user');
  }

  /**
   * Fetches a specific user by their ID from the API.
   * This method sends an HTTP GET request to the API to retrieve a specific user by their ID.
   * @param id The ID of the user to retrieve.
   * @returns An Observable that resolves to a UserById object.
   */
  getById(id: number): Observable<UserById> {
    return this.http.get<UserById>(`${API_URL}/v1/user/${id}`);
  }

  /**
   * Registers a new user in the system.
   * This method sends an HTTP POST request to the API to create a new user account.
   * @param registerData The registration data for the new user.
   * @returns An Observable that resolves to the response from the API.
   */
  registerUser(registerData: RegisterUser): Observable<any> {
    return this.http.post<any>(API_URL + '/v1/register/user', registerData);
  }

  /**
   * Edits an existing user in the system.
   * This method sends an HTTP PUT request to the API to update the details of an existing user.
   * @param user The updated user data.
   * @param id The ID of the user to update.
   * @returns An Observable that resolves to the response from the API.
   */
  editUser(user: EditedUser, id: number): Observable<any> {
    return this.http.put<any>(`${API_URL}/v1/user/${id}`, user);
  }

  /**
   * Deletes a user by their ID from the API.
   * This method sends an HTTP DELETE request to the API to delete a specific user by their ID.
   * @param id The ID of the user to delete.
   * @returns An Observable that resolves to the response from the API.
   */
  deleteUser(id: number): Observable<any> {
    return this.http.delete<any>(`${API_URL}/v1/user/${id}`);
  }
}
