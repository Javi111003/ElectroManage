import { Injectable } from '@angular/core';
import { API_URL } from '../../config/api.config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WorkCenter } from '../../models/workCenter.interface';
import { RegisterTotalConsumption } from '../../models/register.interface';
import { Policy } from '../../models/policy.interface';
import { Alert } from '../../models/alert.interface';


@Injectable({
  providedIn: 'root'
})
export class WorkCenterService {

  constructor(private http: HttpClient) { }

  private workCenterListUrl = API_URL + '/v1/company';
  private registerUrl = API_URL + '/v1/register';

  getWorkCenterList(): Observable<WorkCenter[]> {
    return this.http.get<WorkCenter[]>(this.workCenterListUrl);
  }

  getRegister(): Observable<RegisterTotalConsumption> {
    return this.http.get<RegisterTotalConsumption>(this.registerUrl);
  }

  getPolicies(centerID: number): Observable<Policy[]> {
    return this.http.get<Policy[]>(`${this.workCenterListUrl}/${centerID}/policy`);
  }

  getAlerts(centerID: number): Observable<Alert> {
    return this.http.get<Alert>(`${this.workCenterListUrl}/${centerID}/list_warnings`);
  }
}
