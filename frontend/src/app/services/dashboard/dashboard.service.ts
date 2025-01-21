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

  /**
   * Retrieves the count of centers created and deleted for a given year.
   *
   * @param year The year for which to retrieve the count.
   * @returns An Observable of type CentersPerYear containing the count
   * of created and deleted centers.
   */
  getCentersCreated(year: number): Observable<CentersPerYear> {
    return this.http.get<CentersPerYear>(
      `${API_URL}/v1/dashboard/count_created_deleted?year=${year}`
    );
  }
  /**
   * Retrieves the top five consuming centers.
   *
   * @returns An Observable of an array of MostConsumingCenter objects,
   * representing the top five consuming centers.
   */
  getTopFiveConsumingCenters(): Observable<MostConsumingCenter[]> {
    return this.http.get<MostConsumingCenter[]>(
      `${API_URL}/v1/dashboard/top_five/company_consumption`
    );
  }

  /**
   * Retrieves the top five biggest centers.
   *
   * @returns An Observable of an array of BiggestCenter objects, representing
   * the top five biggest centers.
   */
  getTopFiveBiggestCenters(): Observable<BiggestCenter[]> {
    return this.http.get<BiggestCenter[]>(
      `${API_URL}/v1/dashboard/top_five/company_count_offices`
    );
  }

  /**
   * Retrieves the top five most warned centers.
   *
   * @returns An Observable of an array of MostWarnedCenter objects, representing
   * the top five most warned centers.
   */
  getTopFiveWarnedCenters(year: number): Observable<MostWarnedCenter[]> {
    return this.http.get<MostWarnedCenter[]>(
      `${API_URL}/v1/dashboard/top_five/company_count_warnings/${year}`
    );
  }
}
