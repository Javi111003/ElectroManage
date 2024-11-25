import { Injectable } from '@angular/core';
import { API_URL } from '../../config/api.config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WorkCenter } from '../../models/workCenter.interface';
import { Register } from '../../models/register.interface';
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

  getRegister(): Observable<Register> {
    return this.http.get<Register>(this.registerUrl);
  }
}
