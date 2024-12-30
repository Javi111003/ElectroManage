import { Injectable } from '@angular/core';
import { API_URL } from '../../config/api.config';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Office } from '../../models/office.interface';
import { Equipment, EquipmentBrand, EquipmentInstance, EquipmentSpecification, EquipmentType, EquipPropertyInfo } from '../../models/equipment.interface';

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
   * Fetches the list of equipment types from the API.
   * This method sends an HTTP GET request to the API to retrieve a list of equipment types.
   * @returns An Observable that resolves to an array of EquipPropertyInfo objects.
   */
  getEquipmentTypeList(): Observable<EquipPropertyInfo[]> {
    return this.http.get<EquipPropertyInfo[]>(`${API_URL}/v1/equipment_type`);
  }

  /**
   * Fetches the list of equipment brands from the API.
   * This method sends an HTTP GET request to the API to retrieve a list of equipment brands.
   * @returns An Observable that resolves to an array of EquipPropertyInfo objects.
   */
  getEquipmentBrandList(): Observable<EquipPropertyInfo[]> {
    return this.http.get<EquipPropertyInfo[]>(`${API_URL}/v1/equipment_brand`);
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
    const url = `${API_URL}/v1/equipment_brand/${id}`;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: { id }
    };
    return this.http.delete<any>(url, options);
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
    const url = `${API_URL}/v1/equipment_type/${id}`;
    const options = {
      headers: new HttpHeaders({
        'Content-Type': 'application/json'
      }),
      body: { id }
    };
    return this.http.delete<any>(url, options);
  }

  /**
   * Posts a new equipment specification to the API.
   * This method sends an HTTP POST request to the API to create a new equipment specification.
   * @param specification The EquipmentSpecification object to be posted.
   * @returns An Observable that resolves to the response from the API.
   */
  postEquipmentSpecification(specification: EquipmentSpecification): Observable<any> {
    return this.http.post<any>(`${API_URL}/v1/equipment_specification`, specification);
  }

  /**
   * Posts a new equipment instance to the API.
   * This method sends an HTTP POST request to the API to create a new equipment instance.
   * @param equipment The EquipmentInstance object to be posted.
   * @returns An Observable that resolves to the response from the API.
   */
  postEquipmentInstance(equipment: EquipmentInstance): Observable<any> {
    return this.http.post<any>(`${API_URL}/v1/equipment`, equipment);
  }
}
