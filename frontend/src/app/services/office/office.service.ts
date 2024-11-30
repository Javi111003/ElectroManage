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

  getOfficeList(centerID: number): Observable<Office[]> {
    const url = `${this.officeListUrl}/${centerID}/office`;
    return this.http.get<Office[]>(url);
  }

  getEquipmentList(centerID: number, officeID: number): Observable<Equipment[]> {
    const url = `${this.officeListUrl}/${centerID}/office/${officeID}/equipments`;
    return this.http.get<Equipment[]>(url);
  }
}
