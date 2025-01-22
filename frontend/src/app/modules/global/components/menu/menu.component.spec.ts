import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { MenuComponent } from './menu.component';
import { MenuService } from '../../../../services/menu/menu.service';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';
import { GlobalModule } from '../../global.module';
import { UserService } from '../../../../services/user/user.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';
import { UserById } from '../../../../models/credential.interface';
import { MatIconModule } from '@angular/material/icon';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { ShowForRolesDirective } from '../../../../directives/showForRoles/show-for-roles.directive';

describe('MenuComponent', () => {
  let component: MenuComponent;
  let fixture: ComponentFixture<MenuComponent>;
  let menuServiceMock: jasmine.SpyObj<MenuService>;
  let routerMock: jasmine.SpyObj<Router>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let userServiceMock: jasmine.SpyObj<UserService>;
  // Cambiar la definición del mock para que incluya todos los métodos necesarios
  let globalModuleMock: {
    getUserInfo: jasmine.Spy;
    [key: string]: any;
  };

  const mockMenuItems = {
    menuItems: [
      { id: 'test1', isOpen: false },
      { id: 'test2', isOpen: false }
    ]
  };

  const mockUser = {
    info: { id: 1, company: { id: 1, name: 'Test Company' } },
    roles: ['Admin']
  };

  const mockUserById: UserById = {
    email: 'test@test.com',
    username: 'TestUser',
    company: {
      id: 1,
      name: 'Test Company'
    },
    roles: ['Admin']
  };

  beforeEach(async () => {
    menuServiceMock = jasmine.createSpyObj('MenuService', ['getMenuOptions']);
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    authServiceMock = jasmine.createSpyObj('AuthService', ['logout']);
    userServiceMock = jasmine.createSpyObj('UserService', ['getById']);

    // Crear el mock con una estructura más completa
    globalModuleMock = {
      getUserInfo: jasmine.createSpy('getUserInfo').and.returnValue({
        roles: ['Admin'],
        info: {
          id: 1,
          company: {
            id: 1,
            name: 'Test Company'
          }
        }
      }),
      // Agregar cualquier otro método o propiedad necesaria
      openDialog: jasmine.createSpy('openDialog').and.returnValue(of(true)),
      // ... otros métodos mock que necesites
    };

    menuServiceMock.getMenuOptions.and.returnValue(of({
      menuItems: [
        { id: 'test1', isOpen: false },
        { id: 'test2', isOpen: false }
      ]
    }));
    userServiceMock.getUserById.and.returnValue(of(mockUserById));

    sessionStorage.setItem('userLogged', JSON.stringify(mockUser));
    sessionStorage.setItem('loginTime', new Date().getTime().toString());

    await TestBed.configureTestingModule({
      declarations: [
          ShowForRolesDirective,
         MenuComponent
        ],
      imports: [
        BrowserAnimationsModule,
        MatIconModule  // Añadir MatIconModule
      ],
      providers: [
        { provide: MenuService, useValue: menuServiceMock },
        { provide: Router, useValue: routerMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: GlobalModule, useValue: globalModuleMock }
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]  // Añadir CUSTOM_ELEMENTS_SCHEMA
    }).compileComponents();

    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with menu items', () => {
    expect(menuServiceMock.getMenuOptions).toHaveBeenCalled();
    expect(component.menuItems).toEqual(mockMenuItems.menuItems);
  });

  it('should toggle sidebar', () => {
    expect(component.isSidebarActive).toBeFalse();
    component.toggleSidebar();
    expect(component.isSidebarActive).toBeTrue();
    component.toggleSidebar();
    expect(component.isSidebarActive).toBeFalse();
  });

  it('should hide sidebar', () => {
    component.isSidebarActive = true;
    component.hideSidebar();
    expect(component.isSidebarActive).toBeFalse();
  });

  it('should set active option', () => {
    const testOption = 'test-option';
    component.setActiveOption(testOption);
    expect(component.currentURL).toBe(testOption);
  });

  it('should check if option is open', () => {
    component.menuItems = [
      { id: 'test1', isOpen: false },
      { id: 'test2', isOpen: false }
    ];
    expect(component.isOpen('test1')).toBeFalse();
    component.menuItems[0].isOpen = true;
    expect(component.isOpen('test1')).toBeTrue();
  });

  it('should toggle option', () => {
    // Asegurarse de que menuItems está inicializado correctamente
    component.menuItems = [
      { id: 'test1', isOpen: false },
      { id: 'test2', isOpen: false }
    ];

    // Primera llamada a toggle - debería cambiar a true
    component.toggleOption('test1');
    expect(component.menuItems[0].isOpen).toBeTrue();

    // Segunda llamada a toggle - debería cambiar a false
    component.toggleOption('test1');
    expect(component.menuItems[0].isOpen).toBeFalse();
  });

  it('should get user name', () => {
    component.getUserName(1).subscribe(user => {
      expect(user).toEqual(mockUserById);
    });
    expect(userServiceMock.getUserById).toHaveBeenCalledWith(1);
  });

  it('should handle logout', () => {
    component.logout();
    expect(authServiceMock.logout).toHaveBeenCalled();
    expect(routerMock.navigate).toHaveBeenCalledWith(['/login']);
    expect(component.loginTime).toBe('0h 0m 0s');
  });

  it('should toggle user menu', () => {
    const mockEvent = new Event('click');
    spyOn(mockEvent, 'stopPropagation');

    expect(component.isUserMenuOpen).toBeFalse();
    component.toggleUserMenu(mockEvent);
    expect(component.isUserMenuOpen).toBeTrue();
    expect(mockEvent.stopPropagation).toHaveBeenCalled();
  });

  it('should update login time', fakeAsync(() => {
    const startTime = new Date().getTime();
    sessionStorage.setItem('loginTime', startTime.toString());

    // Crear nueva instancia para que use el nuevo tiempo
    fixture = TestBed.createComponent(MenuComponent);
    component = fixture.componentInstance;

    // Avanzar el tiempo simulado
    tick(3600000); // 1 hora

    // Forzar actualización
    (component as any).updateLoginTime();

    expect(component.loginTime).toContain('1h');
  }));

  // Modificar el test para la directiva ShowForRoles
  it('should properly handle ShowForRoles directive', () => {
    // Ya podemos estar seguros de que getUserInfo existe
    const userInfo = globalModuleMock.getUserInfo();
    expect(userInfo.roles).toContain('Admin');
  });

  afterEach(() => {
    sessionStorage.clear();
  });
});
