import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AvgConsumptionComponent } from './avg-consumption.component';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { GlobalModule } from '../../../../global/global.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

describe('AvgConsumptionComponent', () => {
  let component: AvgConsumptionComponent;
  let fixture: ComponentFixture<AvgConsumptionComponent>;
  let globalModuleMock: any;

  const mockAvgData = [
    {
      companyID: 1,
      yearCostDto: [
        {
          year: 2023,
          meanCost: 1000,
          meanConsumption: 500
        }
      ]
    }
  ];

  beforeEach(async () => {
    globalModuleMock = {
      openDialog: jasmine.createSpy('openDialog').and.returnValue(of(true)),
      httpCenter: {
        getAvgRegisters: jasmine.createSpy('getAvgRegisters').and.returnValue(of(mockAvgData))
      },
      getUserInfo: jasmine.createSpy('getUserInfo').and.returnValue({
        roles: ['Admin'],
        info: { company: { id: 1, name: 'Test Company' } }
      }),
      Reset: jasmine.createSpy('Reset'),
      getWorkCenters: jasmine.createSpy('getWorkCenters'),
      workCenters: [{ id: 1, name: 'Test Center' }]
    };

    await TestBed.configureTestingModule({
      declarations: [AvgConsumptionComponent],
      imports: [
        ReactiveFormsModule,
        FormsModule,
        HttpClientTestingModule,
        BrowserAnimationsModule,
        MatTableModule,
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule
      ],
      providers: [
        FormBuilder,
        { provide: GlobalModule, useValue: globalModuleMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AvgConsumptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form for admin user', () => {
    component.ngOnInit();
    expect(globalModuleMock.Reset).toHaveBeenCalled();
    expect(globalModuleMock.getWorkCenters).toHaveBeenCalled();
  });

  it('should initialize form for non-admin user', () => {
    globalModuleMock.getUserInfo.and.returnValue({
      roles: ['User'],
      info: { company: { id: 1, name: 'Test Company' } }
    });

    const newComponent = new AvgConsumptionComponent(globalModuleMock, new FormBuilder());
    expect(newComponent.options.length).toBe(1);
    expect(newComponent.selectedOptionsIds).toContain(1);
  });

  it('should handle consult click with no selected centers', fakeAsync(() => {
    component.form.patchValue({ workCenters: [] });
    component.onConsultClick();
    tick();

    expect(globalModuleMock.openDialog).toHaveBeenCalledWith('Por favor, selecciona al menos un Centro de Trabajo.');
    expect(component.showTable).toBeFalse();
  }));

  it('should handle consult click with selected centers', fakeAsync(() => {
    const mockCenters = [{ id: 1, name: 'Test Center' }];
    component.form.patchValue({ workCenters: mockCenters });
    component.onConsultClick();
    tick();

    expect(component.showTable).toBeTrue();
    expect(globalModuleMock.httpCenter.getAvgRegisters).toHaveBeenCalledWith([1]);
  }));

  it('should handle average data response correctly', fakeAsync(() => {
    component.form.patchValue({ workCenters: [{ id: 1, name: 'Test Center' }] });
    component.onConsultClick();
    tick();

    expect(component.dataSources['Test Center']).toBeTruthy();
    expect(component.dataSources['Test Center'].data.length).toBe(1);
    expect(component.dataSources['Test Center'].data[0].year).toBe(2023);
  }));

  it('should handle proyection click', () => {
    component.onProyectionClick();
    expect(globalModuleMock.openDialog).toHaveBeenCalledWith('No esta implementado');
  });

  it('should toggle row expansion correctly', () => {
    const testElement = 'Test Row';
    component.toggleRow(testElement);
    expect(component.isRowExpanded(testElement)).toBeTrue();
    
    component.toggleRow(testElement);
    expect(component.isRowExpanded(testElement)).toBeFalse();
  });

  it('should update selected options ids when form changes', () => {
    const mockCenters = [{ id: 1, name: 'Test Center' }, { id: 2, name: 'Test Center 2' }];
    component.form.patchValue({ workCenters: mockCenters });
    
    expect(component.selectedOptionsIds).toEqual([1, 2]);
  });

  afterEach(() => {
    // Cleanup
  });
});
