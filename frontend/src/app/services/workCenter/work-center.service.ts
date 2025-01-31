import { AdminArea, CenterDetails, CenterPropertyInfo, Formula, FormulaInfo, InstallationType, Location, LocationEdited, ManagementTeam, WorkCenterData } from './../../models/workCenter.interface';
import { Injectable } from '@angular/core';
import { API_URL } from '../../config/api.config';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { WorkCenter } from '../../models/workCenter.interface';
import { MeanRegisterData, RegisterPrediction, TotalConsumptionData } from '../../models/register.interface';
import { Alert, Excess } from '../../models/alert.interface';
import { WarningByMonthResponse } from '../../models/dashboard.interface';

@Injectable({
  providedIn: 'root'
})
export class WorkCenterService {
  constructor(private http: HttpClient) { }

  /**
   * Fetches the details of a specific work center by its ID from the API.
   * This method sends an HTTP GET request to the API to retrieve the details of a work center.
   * @param id The ID of the work center to be fetched.
   * @returns An Observable that resolves to a CenterDetails object.
   */
  getCenterById(id: number): Observable<CenterDetails> {
    return this.http.get<CenterDetails>(`${API_URL}/v1/company/${id}`);
  }

  /**
   * Fetches the list of work centers from the API.
   * This method sends an HTTP GET request to the API to retrieve a list of work centers.
   * @returns An Observable that resolves to an array of WorkCenter objects.
   */
  getWorkCenterList(): Observable<WorkCenter[]> {
    return this.http.get<WorkCenter[]>(`${API_URL}/v1/company/list/select`);
  }

  /**
   * Fetches the list of center details from the API.
   * This method sends an HTTP GET request to the API to retrieve a list of center details.
   * @returns An Observable that resolves to an array of CenterDetails objects.
   */
  getCenterDetailsList(): Observable<CenterDetails[]> {
    return this.http.get<CenterDetails[]>(`${API_URL}/v1/company`);
  }

  /**
   * Posts a new work center to the API.
   * This method sends an HTTP POST request to the API to create a new work center.
   * @param center The data of the work center to be created.
   * @returns An Observable that resolves to the response from the API.
   */
  postCenter(center: WorkCenterData): Observable<any> {
    return this.http.post<any>(`${API_URL}/v1/company`, center);
  }

  /**
   * Edits an existing work center.
   * This method sends an HTTP PUT request to the API to update the details of an existing work center.
   * @param center The data of the work center to be updated.
   * @returns An Observable that resolves to the response from the API.
   */
  editCenter(center: WorkCenterData, id: number): Observable<any> {
    return this.http.put<any>(`${API_URL}/v1/company/${id}`, center);
  }

  /**
   * Deletes a work center from the API.
   * This method sends an HTTP DELETE request to the API to remove a work center.
   * @param id The ID of the work center to be deleted.
   * @returns An Observable that resolves to the response from the API.
   */
  deleteCenter(id: number): Observable<any> {
    return this.http.delete(`${API_URL}/v1/company/${id}`);
  }

  /**
   * Fetches the register data from the API.
   * This method sends an HTTP GET request to the API to retrieve the register data.
   * @returns An Observable that resolves to a RegisterTotalConsumption object.
   */
  getRegister(id: number, startDate: string, endDate: string): Observable<TotalConsumptionData> {
    let param = new HttpParams();
    param = param.append('start', startDate);
    param = param.append('end', endDate);
    return this.http.get<TotalConsumptionData>(`${API_URL}/v1/company/${id}/registers`, { params: param });
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
   * Fetches the monthly warnings for a specific work center from the API.
   * This method sends an HTTP GET request to the API to retrieve the count of warnings
   * grouped by month for a specified work center.
   * @param centerID The ID of the work center for which to fetch monthly warnings.
   * @returns An Observable that resolves to a WarningByMonthResponse array containing the monthly warning counts.
   */
  getAlertsById(centerID: number): Observable<WarningByMonthResponse> {
    return this.http.get<WarningByMonthResponse>(`${API_URL}/v1/company/${centerID}/Warnings_ByMonth`);
  }

  /**
   * Fetches the excess data for a given date from the API.
   * This method sends an HTTP GET request to the API to retrieve the excess data
   * for a specified date.
   * @param date The date for which to fetch the excess data.
   * @returns An Observable that resolves to an Excess object.
   */
  getExcess(date: string): Observable<Excess[]> {
    let param = new HttpParams();
    param = param.append('date', date);
    return this.http.get<Excess[]>(`${API_URL}/v1/company/limit`, { params: param });
  }

  /**
   * Fetches the average registers for a given list of work centers from the API.
   * This method sends an HTTP GET request to the API to retrieve the average registers
   * for a specified list of work centers.
   * @param centerIDs The IDs of the work centers for which to fetch average registers.
   * @returns An Observable that resolves to an array of AvgRegisterConsumption objects.
   */
  getAvgRegisters(centerIDs: number[]): Observable<MeanRegisterData[]> {
    let params = new HttpParams();
    centerIDs.forEach(id => {
      params = params.append('companyIds', id.toString());
    });

    return this.http.get<MeanRegisterData[]>(
      `${API_URL}/v1/company/mean_cost_last_three_years`, { params }
    );
  }

  /**
   * Fetches the consumption projections for the next three months for a given list of work centers from the API.
   * This method sends an HTTP GET request to the API to retrieve the consumption projections
   * for a specified list of work centers.
   * @param centerIDs The IDs of the work centers for which to fetch consumption projections.
   * @returns An Observable that resolves to an array of RegisterPrediction objects.
   */
  getPrediction(centerIDs: number[]): Observable<RegisterPrediction[]> {
    let params = new HttpParams();
    centerIDs.forEach(id => {
      params = params.append('companiesId', id.toString());
    });

    return this.http.get<RegisterPrediction[]>(
      `${API_URL}/v1/company/Proyection_Next_Three_Months`, { params }
    );
  }

  /**
   * Fetches the list of administrative areas from the API.
   * This method sends an HTTP GET request to the API to retrieve a list of administrative areas.
   * @returns An Observable that resolves to an array of CenterPropertyInfo objects.
   */
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

  /**
   * Fetches the list of installation types from the API.
   * This method sends an HTTP GET request to the API to retrieve a list of installation types.
   * @returns An Observable that resolves to an array of CenterPropertyInfo objects.
   */
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
   * Edits an existing management team.
   * This method sends an HTTP PUT request to the API to update an existing management team.
   * @param team The ManagementTeam object to be updated.
   * @param centerID The ID of the work center associated with the team.
   * @returns An Observable that resolves to the response from the API.
   */
  editManagementTeam(team: ManagementTeam, centerID: number, teamID: number): Observable<any> {
    return this.http.put<any>(`${API_URL}/v1/company/${centerID}/team/${teamID}`, team);
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

  /**
   * Posts a new location to the API.
   * This method sends an HTTP POST request to the API to create a new location.
   * @param location The Location object to be posted.
   * @returns An Observable that resolves to the response from the API.
   */
  postLocation(location: Location): Observable<any> {
    return this.http.post<any>(`${API_URL}/v1/location`, location);
  }

  /**
   * Edits an existing location.
   * This method sends an HTTP PUT request to the API to update an existing location.
   * @param location The Location object to be updated.
   * @param locationID The ID of the location to be updated.
   * @returns An Observable that resolves to the response from the API.
   */
  editLocation(location: LocationEdited, locationID: number): Observable<any> {
    return this.http.put<any>(`${API_URL}/v1/location/${locationID}`, location);
  }

  /**
   * Deletes a location from the API.
   * This method sends an HTTP DELETE request to the API to remove an existing location.
   * @param id The ID of the location to be deleted.
   * @returns An Observable that resolves to the response from the API.
   */
  deletelocation(id: number): Observable<any> {
    return this.http.delete<any>(`${API_URL}/v1/location/${id}`);
  }

  /**
   * Posts a new cost formula to the API.
   * This method sends an HTTP POST request to the API to create a new cost formula.
   * @param formula The Formula object to be posted.
   * @returns An Observable that resolves to the response from the API.
   */
  postFormula(formula: Formula): Observable<any> {
    return this.http.post<any>(`${API_URL}/v1/cost_formula`, formula);
  }

  /**
   * Edits an existing cost formula.
   * This method sends an HTTP PUT request to the API to update an existing cost formula.
   * @param info The FormulaInfo object containing the updated information.
   * @returns An Observable that resolves to the response from the API.
   */
  editFormula(info: FormulaInfo): Observable<any> {
    return this.http.put<any>(`${API_URL}/v1/cost_formula`, info);
  }

  /**
   * Deletes a cost formula from the API.
   * This method sends an HTTP DELETE request to the API to remove an existing cost formula.
   * @param id The ID of the cost formula to be deleted.
   * @returns An Observable that resolves to the response from the API.
   */
  deleteFormula(id: number): Observable<any> {
    return this.http.delete<any>(`${API_URL}/v1/cost_formula/${id}`);
  }
}
