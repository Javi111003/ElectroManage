import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { PolicyService } from './policy.service';
import { API_URL } from '../../config/api.config';
import { Policy, PolicyByCompany, PolicyInfo } from '../../models/policy.interface';

describe('PolicyService', () => {
  let service: PolicyService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [PolicyService]
    });
    service = TestBed.inject(PolicyService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getPoliciesByCenter', () => {
    it('should return policies for a specific center', () => {
      const centerId = 1;
      const mockPolicies: PolicyByCompany[] = [
        {
          id: 1,
          name: 'Test Policy',
          applyingDate: '2023-01-01',
          companyId: centerId
        }
      ];

      service.getPoliciesByCenter(centerId).subscribe(policies => {
        expect(policies).toEqual(mockPolicies);
      });

      const req = httpMock.expectOne(`${API_URL}/v1/company/${centerId}/list_policies`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPolicies);
    });
  });

  describe('getPolicies', () => {
    it('should return all policies', () => {
      const mockPolicies: PolicyInfo[] = [
        {
          policyId: 1,
          policyName: 'Test Policy',
          description: 'Test Description',
        }
      ];

      service.getPolicies().subscribe(policies => {
        expect(policies).toEqual(mockPolicies);
      });

      const req = httpMock.expectOne(`${API_URL}/v1/policy/list`);
      expect(req.request.method).toBe('GET');
      req.flush(mockPolicies);
    });
  });

  describe('deletePolicy', () => {
    it('should delete a policy', () => {
      const policyId = 1;

      service.deletePolicy(policyId).subscribe();

      const req = httpMock.expectOne(`${API_URL}/v1/efficiency_policy/${policyId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });
  });

  describe('postPolicy', () => {
    it('should create a new policy', () => {
      const mockPolicy: Policy = {
        name: 'New Policy',
        description: 'New Description'
      };

      service.postPolicy(mockPolicy).subscribe();

      const req = httpMock.expectOne(`${API_URL}/v1/policies`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockPolicy);
      req.flush({});
    });
  });

  describe('editPolicy', () => {
    it('should edit an existing policy', () => {
      const policyId = 1;
      const mockPolicy: Policy = {
        name: 'Updated Policy',
        description: 'Updated Description'
      };

      service.editPolicy(mockPolicy, policyId).subscribe();

      const req = httpMock.expectOne(`${API_URL}/v1/policy/${policyId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockPolicy);
      req.flush({});
    });
  });
});
