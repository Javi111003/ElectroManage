import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { RegisterService } from './register.service';
import { API_URL } from '../../config/api.config';
import { Register, RegisterInfo } from '../../models/register.interface';

describe('RegisterService', () => {
  let service: RegisterService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [RegisterService]
    });
    service = TestBed.inject(RegisterService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Register Operations', () => {
    const mockRegister: Register = {
      date: '2024-01-01',
      consumption: 100,
      companyId: 1
    };

    const mockRegisterInfo: RegisterInfo = {
      date: '2024-01-01',
      consumption: 100,
    };

    it('should post new register', () => {
      service.postRegister(mockRegister).subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(`${API_URL}/v1/register`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockRegister);
      req.flush({});
    });

    it('should delete register', () => {
      const registerId = 1;
      service.deleteRegister(registerId).subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(`${API_URL}/v1/register/${registerId}`);
      expect(req.request.method).toBe('DELETE');
      req.flush({});
    });

    it('should edit register', () => {
      const registerId = 1;
      service.editRegister(registerId, mockRegisterInfo).subscribe(response => {
        expect(response).toBeTruthy();
      });

      const req = httpMock.expectOne(`${API_URL}/v1/register/${registerId}`);
      expect(req.request.method).toBe('PUT');
      expect(req.request.body).toEqual(mockRegisterInfo);
      req.flush({});
    });
  });
});
