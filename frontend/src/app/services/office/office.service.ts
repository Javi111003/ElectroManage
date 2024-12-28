import { Injectable } from '@angular/core';
import { API_URL } from '../../config/api.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Office } from '../../models/office.interface';
import { Equipment, EquipmentBrand, EquipmentType } from '../../models/equipment.interface';

@Injectable({
  providedIn: 'root'
})
export class OfficeService {

  constructor(private http: HttpClient) { }

  private officeListUrl = `${API_URL}/v1/company`;


  /**
   * Fetches the list of offices from the API.
   * This method sends an HTTP GET request to the API to retrieve a list of offices.
   * @param centerID The ID of the work center for which to fetch offices.
   * @returns An Observable that resolves to an array of Office objects.
   */
  getOfficeList(centerID: number): Observable<Office[]> {
    const url = `${this.officeListUrl}/${centerID}/office`;
    return this.http.get<Office[]>(url);
  }

  /**
   * Fetches the list of equipment for a given office from the API.
   * This method sends an HTTP GET request to the API to retrieve a list of equipment
   * for a specified office.
   * @param centerID The ID of the work center to which the office belongs.
   * @param officeID The ID of the office for which to fetch equipment.
   * @returns An Observable that resolves to an array of Equipment objects.
   */
  getEquipmentList(centerID: number, officeID: number): Observable<Equipment[]> {
    const url = `${this.officeListUrl}/${centerID}/office/${officeID}/equipments`;
    return this.http.get<Equipment[]>(url);
  }

  /**
   * Posts a new equipment brand to the API.
   * This method sends an HTTP POST request to the API to create a new equipment brand.
   * @param brand The EquipmentBrand object to be posted.
   * @returns An Observable that resolves to the response from the API.
   */
  postEquipmentBrand(brand: EquipmentBrand): Observable<any> {
    return this.http.post<any>(`${API_URL}/v1/equipment_brand`, brand);
  }

  /**
   * Deletes an equipment brand from the API.
   * This method sends an HTTP DELETE request to the API to remove an equipment brand.
   * @param id The ID of the equipment brand to be deleted.
   * @returns An Observable that resolves to the response from the API.
   */
  deleteEquipmentBrand(id: number): Observable<any> {
    return this.http.delete<any>(`${API_URL}/v1/equipment_brand/${id}`);
  }

  /**
   * Posts a new equipment type to the API.
   * This method sends an HTTP POST request to the API to create a new equipment type.
   * @param type The EquipmentType object to be posted.
   * @returns An Observable that resolves to the response from the API.
   */
  postEquipmentType(type: EquipmentType): Observable<any> {
    return this.http.post<any>(`${API_URL}/v1/equipment_type`, type);
  }

  /**
   * Deletes an equipment type from the API.
   * This method sends an HTTP DELETE request to the API to remove an equipment type.
   * @param id The ID of the equipment type to be deleted.
   * @returns An Observable that resolves to the response from the API.
   */
  deleteEquipmentType(id: number): Observable<any> {
    return this.http.delete<any>(`${API_URL}/v1/equipment_type/${id}`);
  }
}
