import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { AuthService } from './auth.service';
import { API_URL } from '../../config/api.config';
import { Credential, UserLogged, UserInfo } from '../../models/credential.interface';

describe('AuthService', () => {
  let service: AuthService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService]
    });
    service = TestBed.inject(AuthService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
    sessionStorage.clear();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('login', () => {
    it('should make POST request to login endpoint', () => {
      const mockCredentials: Credential = {
        email: 'testuser',
        password: 'testpass'
      };

      const mockResponse = { token: 'test-token' };

      service.login(mockCredentials).subscribe(response => {
        expect(response).toEqual(mockResponse);
      });

      const req = httpMock.expectOne(`${API_URL}/v1/login`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockCredentials);
      req.flush(mockResponse);
    });
  });

  describe('isLoggedIn', () => {
    it('should return true when user is authenticated', () => {
      sessionStorage.setItem('isAuthenticated', 'true');
      expect(service.isLoggedIn()).toBeTruthy();
    });

    it('should return false when user is not authenticated', () => {
      sessionStorage.setItem('isAuthenticated', 'false');
      expect(service.isLoggedIn()).toBeFalsy();
    });
  });

  describe('getUserRoles', () => {
    it('should return user roles from session storage', () => {
      const mockUser: UserLogged = {
        info: {
          id: 1,
          email: 'test@test.com',
          company: {
            id: 1,
            name: 'Test Company',
          }
        },
        roles: ['ADMIN', 'USER']
      };
      sessionStorage.setItem('userLogged', JSON.stringify(mockUser));
      
      expect(service.getUserRoles()).toEqual(['ADMIN', 'USER']);
    });

    it('should return empty array when no user data exists', () => {
      sessionStorage.removeItem('userLogged');
      expect(service.getUserRoles()).toEqual([]);
    });
  });

  describe('logout', () => {
    it('should clear session storage', () => {
      // Set some session storage items
      sessionStorage.setItem('isAuthenticated', 'true');
      sessionStorage.setItem('token', 'test-token');
      sessionStorage.setItem('userLogged', '{}');
      sessionStorage.setItem('expiration', 'test-exp');

      service.logout();

      expect(sessionStorage.getItem('isAuthenticated')).toBeNull();
      expect(sessionStorage.getItem('token')).toBeNull();
      expect(sessionStorage.getItem('userLogged')).toBeNull();
      expect(sessionStorage.getItem('expiration')).toBeNull();
    });
  });
});
