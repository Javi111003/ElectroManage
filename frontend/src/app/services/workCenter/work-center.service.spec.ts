import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { WorkCenterService } from './work-center.service';
import { API_URL } from '../../config/api.config';
import { WorkCenter, CenterDetails, AdminArea, InstallationType, Location, ManagementTeam, LocationEdited } from '../../models/workCenter.interface';
import { TotalConsumptionData, MeanRegisterData } from '../../models/register.interface';
import { Alert } from '../../models/alert.interface';

describe('WorkCenterService', () => {
  let service: WorkCenterService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [WorkCenterService]
    });
    service = TestBed.inject(WorkCenterService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Work Center Operations', () => {
    const mockWorkCenter: WorkCenter = {
      id: 1,
      name: 'Test Center'
    };

    const mockCenterDetails: CenterDetails = {
      id: 1,
      name: 'Test Center',
      consumptionLimit: 1000,
      installationType: { id: 1, name: 'Type 1', description: 'Test Type' },
      administrativeArea: { id: 1, name: 'Area 1', description: 'Test Area' },
      location: {
        id: 1,
        addressDetails: 'Test Address',
        coordenateDTO: { latitude: 0, longitude: 0 }
      },
      status: 'ACTIVE',
      managementTeam: {
        id: 1,
        teamName: 'Test Team',
        companyId: 1,
        members: [{ userId: 1, userName: 'Test User' }]
      },
      currentEfficiencyPolicy: {
        efficiencyPolicy: {
          policyId: 1,
          policyName: 'Test Policy',
          description: 'Test Description'
        },
        applyingDate: '2023-01-01',
        to: '2023-12-31'
      },
      currentCostFormula: {
        id: 1,
        name: 'Test Formula',
        expression: 'x * y',
        variables: [
          {
            variableName: 'x',
            expression: '10'
          },
          {
            variableName: 'y',
            expression: '20'
          }
        ]
      }
    };

    it('should get work center list', () => {
      service.getWorkCenterList().subscribe(centers => {
        expect(centers).toEqual([mockWorkCenter]);
      });

      const req = httpMock.expectOne(`${API_URL}/v1/company/list/select`);
      expect(req.request.method).toBe('GET');
      req.flush([mockWorkCenter]);
    });

    it('should get center details list', () => {
      service.getCenterDetailsList().subscribe(centers => {
        expect(centers).toEqual([mockCenterDetails]);
      });

      const req = httpMock.expectOne(`${API_URL}/v1/company`);
      expect(req.request.method).toBe('GET');
      req.flush([mockCenterDetails]);
    });

    it('should delete center', () => {
      service.deleteCenter(1).subscribe();

      const req = httpMock.expectOne(`${API_URL}/v1/company/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });

  describe('Register and Alerts Operations', () => {
    const mockRegister: TotalConsumptionData = {
      totalConsumption: 1000,
      totalCost: 500,
      registers: [{
        id: 1,
        consumption: 100,
        cost: 50,
        date: '2023-01-01'
      }]
    };

    const mockAlert: Alert = {
      companyID: 1,
      companyName: 'Test center',
      warnings: [{
        month: 1,
        year: 2023,
        establishedLimit: 1000,
        consumption: 1200
      }]
    };

    it('should get register data', () => {
      const testId = 1;
      const testStartDate = '2023-01-01';
      const testEndDate = '2023-12-31';

      service.getRegister(testId, testStartDate, testEndDate).subscribe(register => {
        expect(register).toEqual(mockRegister);
      });

      const req = httpMock.expectOne(`${API_URL}/v1/company/${testId}/registers?start=${testStartDate}&end=${testEndDate}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockRegister);
    });

    it('should get alerts', () => {
      service.getAlerts(1).subscribe(alerts => {
        expect(alerts).toEqual(mockAlert);
      });

      const req = httpMock.expectOne(`${API_URL}/v1/company/1/list_warnings`);
      expect(req.request.method).toBe('GET');
      req.flush(mockAlert);
    });

    it('should get average registers', () => {
      const mockAvgRegisters: MeanRegisterData[] = [{
        companyID: 1,
        yearCostDto: [{
          year: 2023,
          meanCost: 500,
          meanConsumption: 1000
        }]
      }];

      service.getAvgRegisters([1]).subscribe(avgRegisters => {
        expect(avgRegisters).toEqual(mockAvgRegisters);
      });

      const req = httpMock.expectOne(`${API_URL}/v1/company/mean_cost_last_three_years?companyIds=1`);
      expect(req.request.method).toBe('GET');
      req.flush(mockAvgRegisters);
    });
  });

  describe('Configuration Operations', () => {
    const mockAdminArea: AdminArea = {
      name: 'Test Area',
      description: 'Test Description'
    };

    const mockInstallationType: InstallationType = {
      name: 'Test Type',
      description: 'Test Description'
    };

    const mockLocation: Location = {
      addressDetails: 'Test Address',
      coordenate: {
        latitude: 0,
        longitude: 0
      }
    };

    const mockLocationEdited: LocationEdited = {
      addressDetails: 'Test Address',
      latitude: 0,
      longitude: 0
    };

    const mockTeam: ManagementTeam = {
      name: 'Test Team',
      userIds: [1, 2]
    };

    it('should handle administrative area operations', () => {
      // POST
      service.postAdminArea(mockAdminArea).subscribe();
      let req = httpMock.expectOne(`${API_URL}/v1/administrative_area`);
      expect(req.request.method).toBe('POST');
      req.flush({});

      // DELETE
      service.deleteAdminArea(1).subscribe();
      req = httpMock.expectOne(`${API_URL}/v1/administrative_area/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });

    it('should handle installation type operations', () => {
      // POST
      service.postInstallationType(mockInstallationType).subscribe();
      let req = httpMock.expectOne(`${API_URL}/v1/installation_type`);
      expect(req.request.method).toBe('POST');
      req.flush({});

      // DELETE
      service.deleteInstallationType(1).subscribe();
      req = httpMock.expectOne(`${API_URL}/v1/installation_type/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });

    it('should handle location operations', () => {
      // POST
      service.postLocation(mockLocation).subscribe();
      let req = httpMock.expectOne(`${API_URL}/v1/location`);
      expect(req.request.method).toBe('POST');
      req.flush({});

      // PUT - Usar mockLocationEdited en lugar de mockLocation
      service.editLocation(mockLocationEdited, 1).subscribe();
      req = httpMock.expectOne(`${API_URL}/v1/location/1`);
      expect(req.request.method).toBe('PUT');
      req.flush({});

      // DELETE
      service.deletelocation(1).subscribe();
      req = httpMock.expectOne(`${API_URL}/v1/location/1`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });

    it('should handle management team operations', () => {
      // POST
      service.postManagementTeam(mockTeam, 1).subscribe();
      let req = httpMock.expectOne(`${API_URL}/v1/company/1/team`);
      expect(req.request.method).toBe('POST');
      req.flush({});

      // DELETE
      service.deleteManagementTeam(1, 2).subscribe();
      req = httpMock.expectOne(`${API_URL}/v1/company/1/team/2`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });
});
