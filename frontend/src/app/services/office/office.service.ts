import { Injectable } from '@angular/core';
import { API_URL } from '../../config/api.config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Office, OfficeInfo } from '../../models/office.interface';
import {
  Equipment, EquipmentBrand, EquipmentInstance, EquipmentSpecification,
  EquipmentSpecificationEdited, EquipmentType, EquipPropertyInfo
} from '../../models/equipment.interface';

@Injectable({
  providedIn: 'root'
})
export class OfficeService {
  constructor(private http: HttpClient) { }

  /**
   * Fetches the list of offices from the API.
   * This method sends an HTTP GET request to the API to retrieve a list of offices.
   * @param centerID The ID of the work center for which to fetch offices.
   * @returns An Observable that resolves to an array of Office objects.
   */
  getOfficeList(centerID: number): Observable<OfficeInfo[]> {
    const url = `${API_URL}/v1/company/${centerID}/office`;
    return this.http.get<OfficeInfo[]>(url);
  }

  /**
   * Posts a new office to the API.
   * This method sends an HTTP POST request to the API to create a new office.
   * @param office The Office object to be posted.
   * @returns An Observable that resolves to the response from the API.
   */
  postOffice(office: Office): Observable<any> {
    return this.http.post<any>(`${API_URL}/v1/office`, office);
  }

  /**
   * Edits an existing office.
   * This method sends an HTTP PUT request to the API to update an existing office.
   * @param office The Office object to be updated.
   * @param officeID The ID of the office to be updated.
   * @returns An Observable that resolves to the response from the API.
   */
  editOffice(office: Office, officeID: number): Observable<any> {
    return this.http.put<any>(`${API_URL}/v1/office/${officeID}`, office);
  }

  /**
   * Deletes an office from the API.
   * This method sends an HTTP DELETE request to the API to remove an existing office.
   * @param officeID The ID of the office to be deleted.
   * @returns An Observable that resolves to the response from the API.
   */
  deleteOffice(officeID: number): Observable<any> {
    return this.http.delete<any>(`${API_URL}/v1/office/${officeID}`);
  }

  /**
   * Fetches the list of equipment for a given office from the API.
   * This method sends an HTTP GET request to the API to retrieve a list of equipment
   * for a specified office.
   * @param officeID The ID of the office for which to fetch equipment.
   * @returns An Observable that resolves to an array of Equipment objects.
   */
  getEquipmentList(officeID: number): Observable<Equipment[]> {
    const url = `${API_URL}/v1/office/${officeID}/list_equipment`;
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
   * Deletes an equipment specification from the API.
   * This method sends an HTTP DELETE request to the API to remove an equipment specification.
   * @param id The ID of the equipment specification to be deleted.
   * @returns An Observable that resolves to the response from the API.
   */
  deleteEquipmentSpecification(id: number): Observable<any> {
    return this.http.delete<any>(`${API_URL}/v1/equipment_specification/${id}`);
  }

  /**
   * Edits an existing equipment specification in the API.
   * This method sends an HTTP PUT request to the API to update an equipment specification.
   * @param specification The EquipmentSpecificationEdited object to be updated.
   * @returns An Observable that resolves to the response from the API.
   */
  editEquipmentSpecification(specification: EquipmentSpecificationEdited): Observable<any> {
    return this.http.put<any>(`${API_URL}/v1/equipment_specification`, specification);
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

  /**
   * Deletes an equipment instance from the API.
   * This method sends an HTTP DELETE request to the API to remove an equipment instance.
   * @param equipmentID The ID of the equipment instance to be deleted.
   * @returns An Observable that resolves to the response from the API.
   */
  deleteEquipmentInstance(equipmentID: number) {
    return this.http.delete<any>(`${API_URL}/v1/equipment/${equipmentID}`);
  }

  /**
   * Edits an existing equipment instance in the API.
   * This method sends an HTTP PUT request to the API to update an equipment instance.
   * @param equipment The EquipmentInstance object to be updated.
   * @param equipmentID The ID of the equipment instance to be updated.
   * @returns An Observable that resolves to the response from the API.
   */
  editEquipmentInstance(equipment: EquipmentInstance, equipmentID: number): Observable<any> {
    return this.http.put<any>(`${API_URL}/v1/equipment/${equipmentID}`, equipment);
  }
}
