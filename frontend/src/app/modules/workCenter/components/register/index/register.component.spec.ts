import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { RegisterComponent } from './register.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GlobalModule } from '../../../../global/global.module';
import { DataService } from '../../../../../services/data/data.service';
import { SnackbarService } from '../../../../../services/snackbar/snackbar.service';
import { RegisterService } from '../../../../../services/register/register.service';
import { of, Subject } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatTableModule } from '@angular/material/table';
import { TotalConsumptionData } from '../../../../../models/register.interface';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let globalModuleMock: any;
  let dataServiceMock: jasmine.SpyObj<DataService>;
  let snackbarServiceMock: jasmine.SpyObj<SnackbarService>;
  let registerServiceMock: jasmine.SpyObj<RegisterService>;

  const mockRegisterData: TotalConsumptionData = {
    totalConsumption: 196.25,
    totalCost: 98.05,
    registers: [
      {
        registerId: 1,
        workCenterId: 1,
        consumption: 100.50,
        cost: 50.25,
        registerDate: '2024-02-20'
      },
      {
        registerId: 2,
        workCenterId: 1,
        consumption: 95.75,
        cost: 47.80,
        registerDate: '2024-02-21'
      }
    ]
  };

  beforeEach(async () => {
    globalModuleMock = {
      Reset: jasmine.createSpy('Reset'),
      getWorkCenters: jasmine.createSpy('getWorkCenters'),
      getUserInfo: jasmine.createSpy('getUserInfo').and.returnValue({
        roles: ['Admin'],
        info: { company: { id: 1, name: 'Test Company' } }
      }),
      openDialog: jasmine.createSpy('openDialog').and.returnValue(of(true)),
      httpCenter: {
        getRegister: jasmine.createSpy('getRegister').and.returnValue(of(mockRegisterData))
      }
    };

    dataServiceMock = jasmine.createSpyObj('DataService', ['setData', 'notifyDataUpdated']);
    Object.defineProperty(dataServiceMock, 'dataUpdated$', {
      get: () => new Subject().asObservable()
    });

    snackbarServiceMock = jasmine.createSpyObj('SnackbarService', ['openSnackBar']);
    registerServiceMock = jasmine.createSpyObj('RegisterService', ['deleteRegister']);
    registerServiceMock.deleteRegister.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [
        ReactiveFormsModule,
        BrowserAnimationsModule,
        MatTableModule
      ],
      providers: [
        FormBuilder,
        { provide: GlobalModule, useValue: globalModuleMock },
        { provide: DataService, useValue: dataServiceMock },
        { provide: SnackbarService, useValue: snackbarServiceMock },
        { provide: RegisterService, useValue: registerServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize properly', () => {
    expect(globalModuleMock.Reset).toHaveBeenCalled();
    expect(globalModuleMock.getWorkCenters).toHaveBeenCalled();
    expect(component.form).toBeDefined();
  });

  it('should initialize form with empty values for admin user', () => {
    expect(component.form.get('workCenter')?.value).toBe('');
    expect(component.form.get('startDate')?.value).toBeNull();
    expect(component.form.get('endDate')?.value).toBeNull();
  });

  it('should initialize form with company values for non-admin user', () => {
    globalModuleMock.getUserInfo.and.returnValue({
      roles: ['User'],
      info: { company: { id: 1, name: 'Test Company' } }
    });

    const newComponent = new RegisterComponent(
      globalModuleMock,
      TestBed.inject(FormBuilder),
      dataServiceMock,
      snackbarServiceMock,
      registerServiceMock
    );

    expect(newComponent.form.get('workCenter')?.value).toEqual({
      id: 1,
      name: 'Test Company'
    });
  });

  it('should handle consult click with invalid form', () => {
    component.onConsultClick();
    expect(globalModuleMock.openDialog).toHaveBeenCalledWith(
      'Por favor, selecciona un Centro de Trabajo, fecha de inicio y de fin válidos.'
    );
    expect(component.showTable).toBeFalse();
  });

  it('should handle consult click with valid form', fakeAsync(() => {
    component.form.patchValue({
      workCenter: { id: 1, name: 'Test Center' },
      startDate: new Date('2024-02-20'),
      endDate: new Date('2024-02-21')
    });

    component.onConsultClick();
    tick();

    expect(component.showTable).toBeTrue();
    expect(globalModuleMock.httpCenter.getRegister).toHaveBeenCalled();
  }));

  it('should calculate total consumption correctly', () => {
    const consumptions = [100.50, 95.75];
    expect(component.getTotalConsumption(consumptions)).toBe(196.25);
  });

  it('should calculate total cost correctly', () => {
    const costs = [50.25, 47.80];
    expect(component.getTotalCost(costs)).toBe(98.05);
  });

  it('should handle delete click', fakeAsync(() => {
    const item = { id: 1 };
    component.delete(item);
    tick();

    expect(globalModuleMock.openDialog).toHaveBeenCalled();
    expect(registerServiceMock.deleteRegister).toHaveBeenCalledWith(1);
  }));

  it('should reload table data correctly', () => {
    component.reloadTableData(mockRegisterData);
    
    expect(component.dataSource.data.length).toBe(2);
    expect(component.footerTable).toEqual([
      'Total',
      '196.25',
      '98.05'
    ]);
    expect(component.noResults).toBeFalse();
  });

  afterEach(() => {
    // Cleanup
  });
});
