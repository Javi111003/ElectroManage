import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Register, RegisterInfo } from '../../models/register.interface';
import { Observable } from 'rxjs';
import { API_URL } from '../../config/api.config';

@Injectable({
  providedIn: 'root'
})
export class RegisterService {
  constructor(private http: HttpClient) { }

  /**
   * Posts a new register to the API.
   * This method sends an HTTP POST request to the API to create a new register.
   * @param register The Register object to be posted.
   * @returns An Observable that resolves to the response from the API.
   */
  postRegister(register: Register): Observable<any> {
    return this.http.post(`${API_URL}/v1/register`, register);
  }

  /**
   * Deletes a register by its ID.
   * This method sends an HTTP DELETE request to the API to delete a register.
   * @param id The ID of the register to be deleted.
   * @returns An Observable that resolves to the response from the API.
   */
  deleteRegister(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/v1/register/${id}`);
  }

  /**
   * Edits an existing register by its ID.
   * This method sends an HTTP PUT request to the API to update a register.
   * @param id The ID of the register to be edited.
   * @param info The RegisterInfo object containing the updated information.
   * @returns An Observable that resolves to the response from the API.
   */
  editRegister(id: number, info: RegisterInfo): Observable<any> {
    return this.http.put(`${API_URL}/v1/register/${id}`, info);
  }
}
