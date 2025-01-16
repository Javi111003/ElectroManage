import { TestBed } from '@angular/core/testing';
import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { MenuService } from './menu.service';

describe('MenuService', () => {
  let service: MenuService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [MenuService]
    });
    service = TestBed.inject(MenuService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getMenuOptions', () => {
    it('should return menu options from json file', () => {
      const mockMenuOptions = {
        menu: [
          {
            title: 'Dashboard',
            icon: 'dashboard',
            link: '/dashboard',
            roles: ['ADMIN', 'USER']
          },
          {
            title: 'Centros de trabajo',
            icon: 'business',
            link: '/work-centers',
            roles: ['ADMIN']
          }
        ]
      };

      service.getMenuOptions().subscribe(menuOptions => {
        expect(menuOptions).toEqual(mockMenuOptions);
      });

      const req = httpMock.expectOne('assets/menu-options.json');
      expect(req.request.method).toBe('GET');
      req.flush(mockMenuOptions);
    });

    it('should handle error when json file is not found', () => {
      service.getMenuOptions().subscribe({
        error: (error) => {
          expect(error.status).toBe(404);
        }
      });

      const req = httpMock.expectOne('assets/menu-options.json');
      req.flush('Not Found', {
        status: 404,
        statusText: 'Not Found'
      });
    });
  });
});
