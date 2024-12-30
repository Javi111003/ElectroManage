import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../config/api.config';
import { Policy, PolicyInfo } from '../../models/policy.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PolicyService {

  constructor(private http: HttpClient) { }

  private workCenterListUrl = API_URL + '/v1/company';

  /**
   * Fetches the policies for a given work center from the API.
   * This method sends an HTTP GET request to the API to retrieve the policies for a
   * specified work center.
   * @param centerID The ID of the work center for which to fetch policies.
   * @returns An Observable that resolves to an array of Policy objects.
   */
  getPolicies(centerID: number): Observable<PolicyInfo[]> {
    return this.http.get<PolicyInfo[]>(`${this.workCenterListUrl}/${centerID}/policy`);
  }

  postPolicy(policy: Policy): Observable<any> {
    return this.http.post<any>(`${API_URL}/v1/policies`, policy);
  }
}
