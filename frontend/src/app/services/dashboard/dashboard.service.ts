import { Injectable } from '@angular/core';
import { API_URL } from '../../config/api.config';
import { Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BiggestCenter, CentersPerYear, MostConsumingCenter, MostWarnedCenter } from '../../models/dashboard.interface';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {

  constructor(private http: HttpClient) { }

  getCentersCreated(year:number):Observable<CentersPerYear> {
    return this.http.get<CentersPerYear>(
      `${API_URL}/v1/dashboard/count_created_deleted?year=${year}`
    );
  }

  getTopFiveConsumingCenters():Observable<MostConsumingCenter[]> {
    return this.http.get<MostConsumingCenter[]>(
      `${API_URL}/v1/dashboard/top_five/company_consumption`
    );
  }

  getTopFiveBiggestCenters():Observable<BiggestCenter[]> {
    return this.http.get<BiggestCenter[]>(
      `${API_URL}/v1/dashboard/top_five/company_count_offices`
    );
  }

  getTopFiveWarnedCenters():Observable<MostWarnedCenter[]> {
    return this.http.get<MostWarnedCenter[]>(
      `${API_URL}/v1/dashboard/top_five/company_count_warnings`
    );
  }
}
