import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { API_URL } from '../../config/api.config';
import { Policy, PolicyApplied, PolicyComparison, PolicyInfo } from '../../models/policy.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class PolicyService {
  constructor(private http: HttpClient) { }

  /**
   * Fetches the policies for a given work center from the API.
   * This method sends an HTTP GET request to the API to retrieve the policies for a
   * specified work center.
   * @param centerID The ID of the work center for which to fetch policies.
   * @returns An Observable that resolves to an array of Policy objects.
   */
  getPoliciesByCenter(centerID: number): Observable<PolicyApplied[]> {
    return this.http.get<PolicyApplied[]>(`${API_URL}/v1/company/${centerID}/list_policies`);
  }

  getPolicyComparison(centerID: number, policyID: number): Observable<PolicyComparison> {
    let param = new HttpParams();
    param = param.append('companyId', centerID);
    param = param.append('efficiencyPolicyId', policyID);
    return this.http.get<PolicyComparison>(`${API_URL}/v1/policy/compare`, { params: param });
  }

  /**
   * Fetches the policies from the API.
   * This method sends an HTTP GET request to the API to retrieve the policies.
   * @returns An Observable that resolves to an array of PolicyInfo objects.
   */
  getPolicies(): Observable<PolicyInfo[]> {
    return this.http.get<PolicyInfo[]>(`${API_URL}/v1/policy/list`);
  }

  /**
   * Deletes a policy from the API.
   * This method sends an HTTP DELETE request to the API to remove a policy.
   * @param policyID The ID of the policy to be deleted.
   * @returns An Observable that resolves to the response from the API.
   */
  deletePolicy(policyID: number): Observable<any> {
    return this.http.delete<any>(`${API_URL}/v1/efficiency_policy/${policyID}`);
  }

  /**
   * Posts a new policy to the API.
   * This method sends an HTTP POST request to the API to create a new policy.
   * @param policy The Policy object to be posted.
   * @returns An Observable that resolves to the response from the API.
   */
  postPolicy(policy: Policy): Observable<any> {
    return this.http.post<any>(`${API_URL}/v1/policies`, policy);
  }

  /**
   * Edits an existing policy.
   * This method sends an HTTP PUT request to the API to update an existing policy.
   * @param policy The Policy object to be updated.
   * @param policyID The ID of the policy to be updated.
   * @returns An Observable that resolves to the response from the API.
   */
  editPolicy(policy: Policy, policyID: number): Observable<any> {
    return this.http.put<any>(`${API_URL}/v1/policy/${policyID}`, policy);
  }
}
