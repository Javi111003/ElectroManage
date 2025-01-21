import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LoginComponent } from './login.component';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';
import { GlobalModule } from '../../global.module';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of, throwError } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let routerMock: jasmine.SpyObj<Router>;
  let authServiceMock: jasmine.SpyObj<AuthService>;
  let globalModuleMock: Partial<GlobalModule>;

  const mockLoginResponse = {
    accessToken: {
      token: 'test-token',
      expiration: '2024-02-20'
    },
    id: 1,
    email: 'test@test.com',
    roles: ['Admin'],
    company: {
      id: 1,
      name: 'Test Company'
    }
  };

  beforeEach(async () => {
    routerMock = jasmine.createSpyObj('Router', ['navigate']);
    authServiceMock = jasmine.createSpyObj('AuthService', ['login']);
    globalModuleMock = {};

    authServiceMock.login.and.returnValue(of(mockLoginResponse));

    await TestBed.configureTestingModule({
      declarations: [LoginComponent],
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule
      ],
      providers: [
        FormBuilder,
        { provide: Router, useValue: routerMock },
        { provide: AuthService, useValue: authServiceMock },
        { provide: GlobalModule, useValue: globalModuleMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(LoginComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.form.get('username')?.value).toBe('');
    expect(component.form.get('password')?.value).toBe('');
  });

  it('should have required validators', () => {
    const usernameControl = component.getControl('username');
    const passwordControl = component.getControl('password');

    usernameControl.setValue('');
    passwordControl.setValue('');

    expect(usernameControl.errors?.['required']).toBeTruthy();
    expect(passwordControl.errors?.['required']).toBeTruthy();
  });

  it('should get control value', () => {
    component.form.patchValue({
      username: 'test@test.com',
      password: 'password123'
    });

    expect(component.getControlValue('username')).toBe('test@test.com');
    expect(component.getControlValue('password')).toBe('password123');
  });

  it('should handle successful login', () => {
    component.form.patchValue({
      username: 'test@test.com',
      password: 'password123'
    });

    component.login();

    expect(authServiceMock.login).toHaveBeenCalledWith({
      email: 'test@test.com',
      password: 'password123'
    });
    expect(routerMock.navigate).toHaveBeenCalledWith(['/']);
    expect(sessionStorage.getItem('token')).toBe('test-token');
    expect(sessionStorage.getItem('isAuthenticated')).toBe('true');
    expect(component.loading).toBeFalse();
  });

  it('should handle login error', () => {
    authServiceMock.login.and.returnValue(throwError(() => new Error('Login failed')));
    
    component.form.patchValue({
      username: 'test@test.com',
      password: 'wrong-password'
    });

    spyOn(console, 'log');
    component.login();

    expect(component.loading).toBeFalse();
    expect(console.log).toHaveBeenCalled();
    expect(sessionStorage.getItem('token')).toBeNull();
  });

  it('should set loading state during login', () => {
    component.form.patchValue({
      username: 'test@test.com',
      password: 'password123'
    });

    expect(component.loading).toBeFalse();
    component.login();
    expect(component.loading).toBeFalse(); // Should be false after successful login
  });
  
  afterEach(() => {
    sessionStorage.clear();
  });
});
