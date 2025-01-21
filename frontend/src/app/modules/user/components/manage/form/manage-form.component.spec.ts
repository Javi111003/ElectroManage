import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageFormComponent } from './manage-form.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { GlobalModule } from '../../../../global/global.module';
import { DataService } from '../../../../../services/data/data.service';
import { UserService } from '../../../../../services/user/user.service';
import { SnackbarService } from '../../../../../services/snackbar/snackbar.service';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { SharedModule } from '../../../../../shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ManageUserFormComponent', () => {
  let component: ManageFormComponent;
  let fixture: ComponentFixture<ManageFormComponent>;
  let globalModuleMock: any;
  let dataServiceMock: jasmine.SpyObj<DataService>;
  let userServiceMock: jasmine.SpyObj<UserService>;
  let snackbarServiceMock: jasmine.SpyObj<SnackbarService>;
  let currentDataSubject: BehaviorSubject<any>;

  beforeEach(async () => {
    currentDataSubject = new BehaviorSubject<any>(null);

    globalModuleMock = {
      openDialog: jasmine.createSpy('openDialog').and.returnValue(of(true)),
      Reset: jasmine.createSpy('Reset'),
      getWorkCenters: jasmine.createSpy('getWorkCenters')
    };

    dataServiceMock = jasmine.createSpyObj('DataService', ['setData', 'notifyDataUpdated']);
    Object.defineProperty(dataServiceMock, 'currentData', {
      get: () => currentDataSubject.asObservable()
    });

    userServiceMock = jasmine.createSpyObj('UserService', ['registerUser']);
    userServiceMock.registerUser.and.returnValue(of({}));

    snackbarServiceMock = jasmine.createSpyObj('SnackbarService', ['openSnackBar']);

    await TestBed.configureTestingModule({
      declarations: [ ManageFormComponent ],
      imports: [
        ReactiveFormsModule,
        SharedModule,
        BrowserAnimationsModule
      ],
      providers: [
        FormBuilder,
        { provide: GlobalModule, useValue: globalModuleMock },
        { provide: DataService, useValue: dataServiceMock },
        { provide: UserService, useValue: userServiceMock },
        { provide: SnackbarService, useValue: snackbarServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ManageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.form.get('userName')?.value).toBe('');
    expect(component.form.get('email')?.value).toBe('');
    expect(component.form.get('password')?.value).toBe('');
    expect(component.form.get('role')?.value).toEqual([]);
    expect(component.form.get('workCenter')?.value).toBe('');
  });

  it('should mark form as invalid when empty', () => {
    expect(component.form.valid).toBeFalsy();
  });

  it('should call Reset and getWorkCenters on init', () => {
    component.ngOnInit();
    expect(globalModuleMock.Reset).toHaveBeenCalled();
    expect(globalModuleMock.getWorkCenters).toHaveBeenCalled();
  });

  it('should update form when receiving data', () => {
    const testData = {
      userName: 'test',
      email: 'test@test.com',
      password: '123456',
      role: [{ id: 1, name: 'Administrador' }],
      workCenter: { id: 1, name: 'Test Center' }
    };
    currentDataSubject.next([testData, true, false]);
    
    expect(component.form.get('userName')?.value).toBe('test');
    expect(component.form.get('email')?.value).toBe('test@test.com');
  });

  it('should show error dialog when submitting invalid form', () => {
    component.onSubmit();
    expect(globalModuleMock.openDialog).toHaveBeenCalledWith('Por favor, rellene todos los campos.');
  });

  it('should reset form on close modal', () => {
    component.form.patchValue({
      userName: 'test',
      email: 'test@test.com'
    });
    component.onCloseModal();
    expect(component.form.get('userName')?.value).toBe(null);
    expect(component.form.get('email')?.value).toBe(null);
  });

  it('should call registerUser when form is valid and submitted', () => {
    const validFormData = {
      userName: 'test',
      email: 'test@test.com',
      password: '123456',
      role: [{ id: 1, name: 'Administrador' }],
      workCenter: { id: 1, name: 'Test Center' }
    };
    
    component.form.patchValue(validFormData);
    component.onSubmit();
    
    expect(globalModuleMock.openDialog).toHaveBeenCalledWith(
      '¿Está seguro de que desea guardar los cambios?',
      true
    );
  });

  it('should handle successful user registration', () => {
    spyOn(component, 'activateCloseButton');
    const validFormData = {
      userName: 'test',
      email: 'test@test.com',
      password: '123456',
      role: [{ id: 1, name: 'Administrador' }],
      workCenter: { id: 1, name: 'Test Center' }
    };
    
    component.form.patchValue(validFormData);
    component.register();
    
    expect(userServiceMock.registerUser).toHaveBeenCalled();
    expect(snackbarServiceMock.openSnackBar).toHaveBeenCalledWith('Añadido exitosamente...');
    expect(dataServiceMock.notifyDataUpdated).toHaveBeenCalled();
    expect(component.activateCloseButton).toHaveBeenCalled();
  });
});
