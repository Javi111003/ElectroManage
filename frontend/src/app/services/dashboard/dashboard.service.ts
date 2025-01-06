import { Injectable } from '@angular/core';
import { API_URL } from '../../config/api.config';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BiggestCenters, CentersCreatedPerYear, MostConsumingCenters, MostWarnedCenters } from '../../models/dashboard.interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  getCentersCreated(year:number):Observable<CentersCreatedPerYear> {
    return this.http.get<CentersCreatedPerYear>(
      `${API_URL}/v1/dashboard/count_created_deleted?year=${year}`
    );
  }

  getTopFiveConsumingCenters():Observable<MostConsumingCenters[]> {
    return this.http.get<MostConsumingCenters[]>(
      `${API_URL}/v1/dashboard/top_five/company_consumption`
    );
  }

  getTopFiveBiggestCenters():Observable<BiggestCenters[]> {
    return this.http.get<BiggestCenters[]>(
      `${API_URL}/v1/dashboard/top_five/company_count_offices`
    );
  }

  getTopFiveWarnedCenters():Observable<MostWarnedCenters[]> {
    return this.http.get<MostWarnedCenters[]>(
      `${API_URL}/v1/dashboard/top_five/company_count_warnings`
    );
  }
}
