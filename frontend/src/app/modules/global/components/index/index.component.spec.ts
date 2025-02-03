import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { IndexComponent } from './index.component';
import { DashboardService } from '../../../../services/dashboard/dashboard.service';
import { GlobalModule } from '../../global.module';
import { WorkCenterService } from '../../../../services/workCenter/work-center.service';
import { of } from 'rxjs';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BiggestCenter, CentersPerYear, MostConsumingCenter, MostWarnedCenter } from '../../../../models/dashboard.interface';
import { ShowForRolesDirective } from '../../../../directives/showForRoles/show-for-roles.directive';

describe('IndexComponent', () => {
  let component: IndexComponent;
  let fixture: ComponentFixture<IndexComponent>;
  let dashboardServiceMock: jasmine.SpyObj<DashboardService>;
  let workCenterServiceMock: jasmine.SpyObj<WorkCenterService>;
  let globalModuleMock: any;

  const mockCentersCreated: CentersPerYear = {
    createdComapniesThisYear: 6,
    existingCompaniesThisYear: 8,
    deletedCompaniesThisYear: 2,
    year: 2023,
    companiesByMonth: [
      {
        month: 1,
        countCreatedCompanies: 2,
        countDeletedCompanies: 1
      },
      // ... puedes agregar más meses si es necesario
    ]
  };

  const mockTopConsumingCenters: MostConsumingCenter[] = [
    { 
      companyId: 1, 
      companyName: 'Company 1',
      totalConsumption: 1000, 
      consumptionLimit: 800,
    },
    { 
      companyId: 2, 
      companyName: 'Company 2',
      totalConsumption: 900, 
      consumptionLimit: 700,
    }
  ];

  const mockTopBiggestCenters : BiggestCenter[] =  [
    { companyId:1, 
      companyName:'HOLA',
      officeCount: 5
    },
    { companyName: 'Company 2',
      companyId:2,
      officeCount: 8, 
    }
  ];

  const mockTopWarnedCenters :MostWarnedCenter[]= [
    {
      company: {
        id: 2,
        name: 'Company 1'
      },
      countWarning: 2,
      countWarningByMonth: []
    }
  ];

  beforeEach(async () => {
    dashboardServiceMock = jasmine.createSpyObj('DashboardService', [
      'getCentersCreated',
      'getTopFiveConsumingCenters',
      'getTopFiveBiggestCenters',
      'getTopFiveWarnedCenters'
    ]);
    workCenterServiceMock = jasmine.createSpyObj('WorkCenterService', ['getList']);
    globalModuleMock = {
      getUserInfo: jasmine.createSpy('getUserInfo').and.returnValue({
        roles: ['Admin'],
        info: { company: { id: 1, name: 'Test Company' } }
      })
    };

    // Configure mock responses
    dashboardServiceMock.getCentersCreated.and.returnValue(of(mockCentersCreated));
    dashboardServiceMock.getTopFiveConsumingCenters.and.returnValue(of(mockTopConsumingCenters));
    dashboardServiceMock.getTopFiveBiggestCenters.and.returnValue(of(mockTopBiggestCenters));
    dashboardServiceMock.getTopFiveWarnedCenters.and.returnValue(of(mockTopWarnedCenters));

    await TestBed.configureTestingModule({
      declarations: [
        IndexComponent,
        ShowForRolesDirective
      ],
      providers: [
        { provide: DashboardService, useValue: dashboardServiceMock },
        { provide: WorkCenterService, useValue: workCenterServiceMock },
        { provide: GlobalModule, useValue: globalModuleMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(IndexComponent);
    component = fixture.componentInstance;

    // Forzar la llamada a loadAllData manualmente
    spyOn(component, 'loadAllData').and.callThrough();
    
    fixture.detectChanges();
    
    // Forzar la ejecución del setTimeout
    jasmine.clock().install();
    jasmine.clock().tick(0);
  });

  afterEach(() => {
    jasmine.clock().uninstall();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load centers created data', fakeAsync(() => {
    component.getCentersCreated(2023);
    tick(); // Esperar a que se complete la operación asíncrona
    
    expect(dashboardServiceMock.getCentersCreated).toHaveBeenCalledWith(2023);
    expect(component.centersCreatedData).toEqual(mockCentersCreated);  // Modificado aquí
  }));

  // Modificar los tests existentes para usar fakeAsync cuando sea necesario
  it('should load top consuming centers', fakeAsync(() => {
    component.getTopFiveConsumingCenters();
    tick();
    expect(dashboardServiceMock.getTopFiveConsumingCenters).toHaveBeenCalled();
    expect(component.topConsumingCenters).toEqual(mockTopConsumingCenters);
  }));

  it('should load top biggest centers', fakeAsync(() => {
    component.getTopFiveBiggestCenters();
    tick();
    expect(dashboardServiceMock.getTopFiveBiggestCenters).toHaveBeenCalled();
    expect(component.topBiggestCenters).toEqual(mockTopBiggestCenters);
  }));

  it('should load top warned centers', fakeAsync(() => {
    component.getTopFiveWarnedCenters(2023); // Añadir el año como parámetro
    tick();
    expect(dashboardServiceMock.getTopFiveWarnedCenters).toHaveBeenCalledWith(2023);
    expect(component.topWarnedCenters).toEqual(mockTopWarnedCenters);
  }));

  it('should handle year change', fakeAsync(() => {
    const mockEvent = { target: { value: '2024' } };
    component.onYearChange(mockEvent);
    tick();
    expect(component.selectedYear).toBe(2024);
    expect(dashboardServiceMock.getCentersCreated).toHaveBeenCalledWith(2024);
  }));

  it('should create charts when data is loaded', () => {
    spyOn(component, 'createLineChart');
    spyOn(component, 'createPieChart');
    spyOn(component, 'createExcessBarChart');
    spyOn(component, 'createAlertTrendChart');

    component.loadAllData();
    
    // Use setTimeout to allow the loadAllData timeout to complete
    setTimeout(() => {
      expect(component.createLineChart).toHaveBeenCalled();
      expect(component.createPieChart).toHaveBeenCalled();
      expect(component.createExcessBarChart).toHaveBeenCalled();
      expect(component.createAlertTrendChart).toHaveBeenCalled();
    }, 0);
  });
});
