import { AdminArea, CenterDetails, CenterPropertyInfo, InstallationType, Location, ManagementTeam } from './../../models/workCenter.interface';
import { Injectable } from '@angular/core';
import { API_URL } from '../../config/api.config';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WorkCenter } from '../../models/workCenter.interface';
import { AvgRegisterConsumption, RegisterTotalConsumption } from '../../models/register.interface';
import { Alert } from '../../models/alert.interface';


@Injectable({
  providedIn: 'root'
})
export class WorkCenterService {

  constructor(private http: HttpClient) { }

  private workCenterListUrl = API_URL + '/v1/company/list/select';
  private registerUrl = API_URL + '/v1/register';


  /**
   * Fetches the list of work centers from the API.
   * This method sends an HTTP GET request to the API to retrieve a list of work centers.
   * @returns An Observable that resolves to an array of WorkCenter objects.
   */
  getWorkCenterList(): Observable<WorkCenter[]> {
    return this.http.get<WorkCenter[]>(this.workCenterListUrl);
  }

  getCenterDetailsList(): Observable<CenterDetails[]> {
    return this.http.get<CenterDetails[]>(`${API_URL}/v1/company`);
  }

  deleteCenter(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/v1/company/${id}`);
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
   * Fetches the alerts for a given work center from the API.
   * This method sends an HTTP GET request to the API to retrieve the alerts for
   * a specified work center.
   * @param centerID The ID of the work center for which to fetch alerts.
   * @returns An Observable that resolves to an Alert object.
   */
  getAlerts(centerID: number): Observable<Alert> {
    return this.http.get<Alert>(`${API_URL}/v1/company/${centerID}/list_warnings`);
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
      params = params.append('companyIds', id.toString());
    });

    return this.http.get<AvgRegisterConsumption[]>(
      `${API_URL}/v1/company/mean_cost_last_three_years`, { params }
    );
  }

  getAdminAreas(): Observable<CenterPropertyInfo[]> {
    return this.http.get<CenterPropertyInfo[]>(API_URL + '/v1/administrative_area');
  }

  /**
   * Posts a new administrative area to the API.
   * This method sends an HTTP POST request to the API to create a new administrative area.
   * @param area The AdminArea object to be posted.
   * @returns An Observable that resolves to the response from the API.
   */
  postAdminArea(area: AdminArea): Observable<any> {
    return this.http.post<any>(API_URL + '/v1/administrative_area', area);
  }

  /**
   * Deletes an administrative area from the API.
   * This method sends an HTTP DELETE request to the API to remove an administrative area.
   * @param id The ID of the administrative area to be deleted.
   * @returns An Observable that resolves to the response from the API.
   */
  deleteAdminArea(id: number): Observable<any> {
    return this.http.delete<any>(`${API_URL}/v1/administrative_area/${id}`);
  }

  getInstallationType(): Observable<CenterPropertyInfo[]> {
    return this.http.get<CenterPropertyInfo[]>(API_URL + '/v1/installation_type');
  }

  /**
   * Posts a new installation type to the API.
   * This method sends an HTTP POST request to the API to create a new installation type.
   * @param type The InstallationType object to be posted.
   * @returns An Observable that resolves to the response from the API.
   */
  postInstallationType(type: InstallationType): Observable<any> {
    return this.http.post<any>(API_URL + '/v1/installation_type', type);
  }

  /**
   * Deletes an installation type from the API.
   * This method sends an HTTP DELETE request to the API to remove an installation type.
   * @param id The ID of the installation type to be deleted.
   * @returns An Observable that resolves to the response from the API.
   */
  deleteInstallationType(id: number): Observable<any> {
    return this.http.delete<any>(`${API_URL}/v1/installation_type/${id}`);
  }

  /**
   * Posts a new management team to the API.
   * This method sends an HTTP POST request to the API to create a new management team.
   * @param team The ManagementTeam object to be posted.
   * @param centerID The ID of the work center associated with the team.
   * @returns An Observable that resolves to the response from the API.
   */
  postManagementTeam(team: ManagementTeam, centerID: number): Observable<any> {
    return this.http.post<any>(`${API_URL}/v1/company/${centerID}/team`, team);
  }

  /**
   * Deletes a management team from the API.
   * This method sends an HTTP DELETE request to the API to remove a management team.
   * @param CenterID The ID of the work center associated with the team.
   * @param teamID The ID of the management team to be deleted.
   * @returns An Observable that resolves to the response from the API.
   */
  deleteManagementTeam(CenterID: number, teamID: number): Observable<any> {
    return this.http.delete<any>(`${API_URL}/v1/company/${CenterID}/team/${teamID}`);
  }

  postLocation(location: Location): Observable<any> {
    return this.http.post<any>(`${API_URL}/v1/location`, location);
  }

  editLocation(location: Location, locationID: number): Observable<any> {
    return this.http.put<any>(`${API_URL}/v1/location/${locationID}`, location);
  }
}
