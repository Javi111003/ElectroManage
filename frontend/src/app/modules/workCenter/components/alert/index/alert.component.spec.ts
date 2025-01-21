import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AlertComponent } from './alert.component';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { GlobalModule } from '../../../../global/global.module';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { TableComponent } from '../../../../../shared/components/table/table.component';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of } from 'rxjs';

describe('AlertComponent', () => {
  let component: AlertComponent;
  let fixture: ComponentFixture<AlertComponent>;
  let globalModuleMock: any;

  const mockAlertData = {
    warnings: [
      {
        month: 'January',
        year: 2023,
        consumption: 1200,
        establishedLimit: 1000
      }
    ]
  };

  beforeEach(async () => {
    globalModuleMock = {
      openDialog: jasmine.createSpy('openDialog').and.returnValue(of(true)),
      httpCenter: {
        getAlerts: jasmine.createSpy('getAlerts').and.returnValue(of(mockAlertData))
      },
      getUserInfo: jasmine.createSpy('getUserInfo').and.returnValue({
        roles: ['Admin'],
        info: { company: { id: 1, name: 'Test Company' } }
      }),
      Reset: jasmine.createSpy('Reset'),
      getWorkCenters: jasmine.createSpy('getWorkCenters')
    };

    await TestBed.configureTestingModule({
      declarations: [
        AlertComponent,
        ButtonComponent,
        TableComponent
      ],
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

    fixture = TestBed.createComponent(AlertComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize for admin user', () => {
    component.ngOnInit();
    expect(globalModuleMock.Reset).toHaveBeenCalled();
    expect(globalModuleMock.getWorkCenters).toHaveBeenCalled();
  });
  it('should handle consult click with invalid work center', fakeAsync(() => {
    component.form.patchValue({ workCenter: { id: null, name: '' } });
    component.onConsultClick();
    tick();

    expect(globalModuleMock.openDialog).toHaveBeenCalledWith('Por favor, selecciona un Centro de Trabajo válido.');
    expect(component.showTable).toBeFalse();
  }));

  it('should handle consult click with valid work center', fakeAsync(() => {
    component.form.patchValue({ workCenter: { id: 1, name: 'Test Center' } });
    component.onConsultClick();
    tick();

    expect(globalModuleMock.httpCenter.getAlerts).toHaveBeenCalledWith(1);
    expect(component.showTable).toBeTrue();
    expect(component.dataSource.data.length).toBe(1);
  }));

  it('should handle empty alert data', fakeAsync(() => {
    globalModuleMock.httpCenter.getAlerts.and.returnValue(of({ warnings: [] }));
    component.form.patchValue({ workCenter: { id: 1, name: 'Test Center' } });
    component.onConsultClick();
    tick();

    expect(component.noResults).toBeTrue();
    expect(component.dataSource.data.length).toBe(0);
  }));

  it('should format alert data correctly', fakeAsync(() => {
    component.form.patchValue({ workCenter: { id: 1, name: 'Test Center' } });
    component.onConsultClick();
    tick();

    const formattedData = component.dataSource.data[0];
    expect(formattedData.date).toBe('January/2023');
    expect(formattedData.consumption).toBe('1200.00');
    expect(formattedData.monthlyLimit).toBe('1000.00');
    expect(formattedData.excess).toBe('200.00');
  }));

  it('should reset table on form changes', () => {
    component.showTable = true;
    component.dataSource.data = [{ someData: 'test' }];
    
    component.form.patchValue({ workCenter: { id: 2, name: 'Another Center' } });
    
    expect(component.showTable).toBeFalse();
    expect(component.dataSource.data.length).toBe(0);
  });

  afterEach(() => {
    // Cleanup
  });
});
