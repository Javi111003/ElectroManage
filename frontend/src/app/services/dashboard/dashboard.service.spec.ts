import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { DashboardService } from './dashboard.service';
import { API_URL } from '../../config/api.config';
import { BiggestCenter, CentersPerYear, MostConsumingCenter, MostWarnedCenter } from '../../models/dashboard.interface';

describe('DashboardService', () => {
  let service: DashboardService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [DashboardService]
    });
    service = TestBed.inject(DashboardService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getCentersCreated', () => {
    it('should return centers created data for a specific year', () => {
      const testYear = 2023;
      const mockResponse: CentersPerYear = {
        createdComapniesThisYear: 2,
        deletedCompaniesThisYear: 2,
        existingCompaniesThisYear: 0,
        year: 0,
        companiesByMonth: []
      };

      service.getCentersCreated(testYear).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${API_URL}/v1/dashboard/count_created_deleted?year=${testYear}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getTopFiveConsumingCenters', () => {
    it('should return top five consuming centers', () => {
      const mockResponse: MostConsumingCenter[] = [
        { companyId: 1, companyName: "test center",
          consumptionLimit: 0, totalConsumption: 1000 },
        { companyId: 2, companyName: "test center 2",
          consumptionLimit:0, totalConsumption: 800 }
      ];

      service.getTopFiveConsumingCenters().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${API_URL}/v1/dashboard/top_five/company_consumption`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });

  describe('getTopFiveBiggestCenters', () => {
    it('should return top five biggest centers', () => {
      const mockResponse: BiggestCenter[] = [
        { companyId: 1, companyName: 'Company A', officeCount: 50 },
        { companyId: 2, companyName: 'Company B', officeCount: 40 }
      ];

      service.getTopFiveBiggestCenters().subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${API_URL}/v1/dashboard/top_five/company_count_offices`);
      expect(req.request.method).toBe('GET');
      req.flush(mockResponse);
    });
  });
});
