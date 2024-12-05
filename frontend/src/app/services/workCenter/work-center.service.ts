import { Injectable } from '@angular/core';
import { API_URL } from '../../config/api.config';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WorkCenter } from '../../models/workCenter.interface';
import { AvgRegisterConsumption, RegisterTotalConsumption } from '../../models/register.interface';
import { Policy } from '../../models/policy.interface';
import { Alert } from '../../models/alert.interface';


@Injectable({
  providedIn: 'root'
})
export class WorkCenterService {

  constructor(private http: HttpClient) { }

  private workCenterListUrl = API_URL + '/v1/company';
  private registerUrl = API_URL + '/v1/register';


  /**
   * Fetches the list of work centers from the API.
   * This method sends an HTTP GET request to the API to retrieve a list of work centers.
   * @returns An Observable that resolves to an array of WorkCenter objects.
   */
  getWorkCenterList(): Observable<WorkCenter[]> {
    return this.http.get<WorkCenter[]>(this.workCenterListUrl);
  }

  /**
   * Fetches the register data from the API.
   * This method sends an HTTP GET request to the API to retrieve the register data.
   * @returns An Observable that resolves to a RegisterTotalConsumption object.
   */
  getRegister(): Observable<RegisterTotalConsumption> {
    return this.http.get<RegisterTotalConsumption>(this.registerUrl);
  }

  /**
   * Fetches the policies for a given work center from the API.
   * This method sends an HTTP GET request to the API to retrieve the policies for a
   * specified work center.
   * @param centerID The ID of the work center for which to fetch policies.
   * @returns An Observable that resolves to an array of Policy objects.
   */
  getPolicies(centerID: number): Observable<Policy[]> {
    return this.http.get<Policy[]>(`${this.workCenterListUrl}/${centerID}/policy`);
  }

  /**
   * Fetches the alerts for a given work center from the API.
   * This method sends an HTTP GET request to the API to retrieve the alerts for
   * a specified work center.
   * @param centerID The ID of the work center for which to fetch alerts.
   * @returns An Observable that resolves to an Alert object.
   */
  getAlerts(centerID: number): Observable<Alert> {
    return this.http.get<Alert>(`${this.workCenterListUrl}/${centerID}/list_warnings`);
  }

  /**
   * Fetches the average registers for a given list of work centers from the API.
   * This method sends an HTTP GET request to the API to retrieve the average registers
   * for a specified list of work centers.
   * @param centerIDs The IDs of the work centers for which to fetch average registers.
   * @returns An Observable that resolves to an array of AvgRegisterConsumption objects.
   */
  getAvgRegisters(centerIDs: number[]): Observable<AvgRegisterConsumption[]> {
    let params = new HttpParams();
    centerIDs.forEach(id => {
      params = params.append('ids', id.toString());
    });

    return this.http.get<AvgRegisterConsumption[]>(
      `${this.workCenterListUrl}/last_three_years`, { params }
    );
  }
}
