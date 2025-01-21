import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { UserService } from './user.service';
import { API_URL } from '../../config/api.config';
import { RegisterUser, UserById, UserLogged } from '../../models/credential.interface';

describe('UserService', () => {
  let service: UserService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [UserService]
    });
    service = TestBed.inject(UserService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getUsersList', () => {
    it('should return list of users', () => {
      const mockUsers: UserLogged[] = [
        {
          id: 1,
          email: 'test@test.com',
          company: {
            id: 1,
            name: 'Test Company'
          },
          username: '',
          roles: []
        }
      ];

      service.getUsersList().subscribe(users => {
        expect(users).toEqual(mockUsers);
      });

      const req = httpMock.expectOne(`${API_URL}/v1/user`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUsers);
    });
  });

  describe('getById', () => {
    it('should return user by id', () => {
      const userId = 1;
      const mockUser: UserById = {
        email: 'test@test.com',
        username: 'testuser',
        company: {
          id: 1,
          name: 'Test Company'
        },
        roles: ['USER']
      };

      service.getById(userId).subscribe(user => {
        expect(user).toEqual(mockUser);
      });

      const req = httpMock.expectOne(`${API_URL}/v1/user/${userId}`);
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);
    });
  });

  describe('registerUser', () => {
    it('should register a new user', () => {
      const mockRegisterData: RegisterUser = {
        email: 'test@test.com',
        username: 'testuser',
        password: 'testpass',
        roles: ['USER'],
        companyId: 1
      };

      service.registerUser(mockRegisterData).subscribe();

      const req = httpMock.expectOne(`${API_URL}/v1/register/user`);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual(mockRegisterData);
      req.flush({});
    });
  });
});
