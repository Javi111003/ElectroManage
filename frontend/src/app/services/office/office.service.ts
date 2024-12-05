import { Injectable } from '@angular/core';
import { API_URL } from '../../config/api.config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Office } from '../../models/office.interface';
import { Equipment } from '../../models/equipment.interface';

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
}
