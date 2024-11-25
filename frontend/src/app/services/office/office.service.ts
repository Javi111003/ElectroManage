import { Injectable } from '@angular/core';
import { API_URL } from '../../config/api.config';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Office } from '../../models/office.interface';

@Injectable({
  providedIn: 'root'
})
export class OfficeService {

  constructor(private http: HttpClient) { }

  private officeListUrl = API_URL + '/v1/office';

  getOfficeList(): Observable<Office[]> {
    return this.http.get<Office[]>(this.officeListUrl);
  }
}
