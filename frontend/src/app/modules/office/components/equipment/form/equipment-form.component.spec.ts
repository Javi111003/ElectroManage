import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GlobalModule } from '../../../../global/global.module';
import { DataService } from '../../../../../services/data/data.service';
import { SnackbarService } from '../../../../../services/snackbar/snackbar.service';
import { SharedModule } from '../../../../../shared/shared.module';
import { EquipmentFormComponent } from './equipment-form.component';
import { OfficeService } from '../../../../../services/office/office.service';
import { BehaviorSubject, of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('EquipmentFormComponent', () => {
  let component: EquipmentFormComponent;
  let fixture: ComponentFixture<EquipmentFormComponent>;
  let globalModuleMock: any;
  let dataServiceMock: jasmine.SpyObj<DataService>;
  let snackbarServiceMock: jasmine.SpyObj<SnackbarService>;
  let officeServiceMock: jasmine.SpyObj<OfficeService>;

  beforeEach(async () => {
    globalModuleMock = {
      Reset: jasmine.createSpy('Reset'),
      getWorkCenters: jasmine.createSpy('getWorkCenters'),
      getOfficesByCenter: jasmine.createSpy('getOfficesByCenter').and.returnValue(of([])),
      getUserInfo: jasmine.createSpy('getUserInfo').and.returnValue({
        roles: ['User'],
        info: { company: { id: 1, name: 'Test Company' } }
      }),
      openDialog: jasmine.createSpy('openDialog').and.returnValue(of(true)),
      formatLocalDate: jasmine.createSpy('formatLocalDate').and.returnValue('2024-01-01'),
      allValid: jasmine.createSpy('allValid').and.returnValue([true, '']),
      offices: []
    };

    dataServiceMock = jasmine.createSpyObj('DataService', ['setData', 'notifyDataUpdated']);
    // Configurar currentData como BehaviorSubject
    Object.defineProperty(dataServiceMock, 'currentData', {
      get: () => new BehaviorSubject(null)
    });

    snackbarServiceMock = jasmine.createSpyObj('SnackbarService', ['openSnackBar']);
    
    officeServiceMock = jasmine.createSpyObj('OfficeService', [
      'getEquipmentTypeList',
      'getEquipmentBrandList',
      'postEquipmentType',
      'postEquipmentBrand',
      'deleteEquipmentType',
      'deleteEquipmentBrand',
      'postEquipmentSpecification',
      'editEquipmentSpecification',
      'postEquipmentInstance',
      'editEquipmentInstance'
    ]);

    // Configurar respuestas mock para los métodos del servicio
    officeServiceMock.getEquipmentTypeList.and.returnValue(of([]));
    officeServiceMock.getEquipmentBrandList.and.returnValue(of([]));
    officeServiceMock.postEquipmentType.and.returnValue(of({ id: 1, name: 'Test Type' }));
    officeServiceMock.postEquipmentBrand.and.returnValue(of({ id: 1, name: 'Test Brand' }));
    officeServiceMock.postEquipmentSpecification.and.returnValue(of({ id: 1 }));
    officeServiceMock.postEquipmentInstance.and.returnValue(of({}));

    await TestBed.configureTestingModule({
      declarations: [ EquipmentFormComponent ],
      imports: [ 
        ReactiveFormsModule,
        BrowserAnimationsModule,
        SharedModule
      ],
      providers: [
        FormBuilder,
        { provide: GlobalModule, useValue: globalModuleMock },
        { provide: DataService, useValue: dataServiceMock },
        { provide: SnackbarService, useValue: snackbarServiceMock },
        { provide: OfficeService, useValue: officeServiceMock }
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    }).compileComponents();

    fixture = TestBed.createComponent(EquipmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with default values', () => {
    expect(component.form.get('workCenter')).toBeTruthy();
    expect(component.form.get('office')).toBeTruthy();
    expect(component.form.get('type')).toBeTruthy();
    expect(component.form.get('brand')).toBeTruthy();
  });

  it('should call Reset and getWorkCenters on init', () => {
    component.ngOnInit();
    expect(globalModuleMock.Reset).toHaveBeenCalled();
    expect(globalModuleMock.getWorkCenters).toHaveBeenCalled();
  });

  it('should load equipment types and brands on init', () => {
    component.ngOnInit();
    expect(officeServiceMock.getEquipmentTypeList).toHaveBeenCalled();
    expect(officeServiceMock.getEquipmentBrandList).toHaveBeenCalled();
  });
});
