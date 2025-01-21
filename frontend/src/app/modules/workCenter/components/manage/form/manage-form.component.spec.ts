import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ManageFormComponent } from './manage-form.component';
import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { GlobalModule } from '../../../../global/global.module';
import { DataService } from '../../../../../services/data/data.service';
import { SnackbarService } from '../../../../../services/snackbar/snackbar.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AutocompleteComponent } from '../../../../../shared/components/autocomplete/autocomplete.component';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { ChipsComponent  } from '../../../../../shared/components/chips/chips.component';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatChipsModule } from '@angular/material/chips';
import { of, Subject } from 'rxjs';
import * as L from 'leaflet';

describe('ManageWorkCenterFormComponent', () => {
  let component: ManageFormComponent;
  let fixture: ComponentFixture<ManageFormComponent>;
  let globalModuleMock: any;
  let dataServiceMock: jasmine.SpyObj<DataService>;
  let snackbarServiceMock: jasmine.SpyObj<SnackbarService>;

  const mockData = {
    id: 1,
    name: 'Test Center',
    adminArea: {
      id: 1,
      name: 'Test Area'
    },
    instalType: {
      id: 1,
      name: 'Test Type'
    },
    areaAdminName: 'Test Area',
    instalationType: 'Test Type',
    location: {
      addressDetails: 'Test Address',
      coordenateDTO: {
        latitude: 22,
        longitude: -80
      }
    },
    applyingDate: '2024-01-01'
  };

  beforeEach(async () => {
    globalModuleMock = {
      openDialog: jasmine.createSpy('openDialog').and.returnValue(of(true)),
      httpCenter: {
        getInstallationType: jasmine.createSpy('getInstallationType').and.returnValue(of([])),
        getAdminAreas: jasmine.createSpy('getAdminAreas').and.returnValue(of([])),
        postInstallationType: jasmine.createSpy('postInstallationType').and.returnValue(of({ id: 1, name: 'Test Type' })),
        postAdminArea: jasmine.createSpy('postAdminArea').and.returnValue(of({ id: 1, name: 'Test Area' })),
        deleteInstallationType: jasmine.createSpy('deleteInstallationType').and.returnValue(of({})),
        deleteAdminArea: jasmine.createSpy('deleteAdminArea').and.returnValue(of({}))
      },
      allValid: jasmine.createSpy('allValid').and.returnValue([true, ''])
    };

    dataServiceMock = jasmine.createSpyObj('DataService', ['setData', 'notifyDataUpdated']);
    Object.defineProperty(dataServiceMock, 'currentData', {
      get: () => new Subject().asObservable()
    });

    snackbarServiceMock = jasmine.createSpyObj('SnackbarService', ['openSnackBar']);

    await TestBed.configureTestingModule({
      declarations: [
        ManageFormComponent,
        AutocompleteComponent,
        ButtonComponent,
        ChipsComponent
      ],
      imports: [
        ReactiveFormsModule,
        FormsModule, // Añadir este módulo
        HttpClientTestingModule,
        BrowserAnimationsModule,
        MatIconModule,
        MatFormFieldModule,
        MatInputModule,
        MatAutocompleteModule,
        MatChipsModule  // Añadir este módulo
      ],
      providers: [
        FormBuilder,
        { provide: GlobalModule, useValue: globalModuleMock },
        { provide: DataService, useValue: dataServiceMock },
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

  it('should initialize form with default values', () => {
    expect(component.form.get('name')).toBeTruthy();
    expect(component.form.get('adminAreaName')).toBeTruthy();
    expect(component.form.get('instalationType')).toBeTruthy();
    expect(component.form.get('monthlyConsumptionLimit')).toBeTruthy();
    expect(component.form.get('formula')).toBeTruthy();
  });

  it('should handle form submission with invalid form', fakeAsync(() => {
    component.form.setErrors({ invalid: true });
    component.onSubmit();
    tick();

    expect(globalModuleMock.openDialog).toHaveBeenCalledWith('Por favor, rellene todos los campos.');
    expect(component.loading).toBeFalse();
  }));

  it('should handle add installation type', fakeAsync(() => {
    const type = { name: 'New Type' };
    component.form.get('instalationType')?.setValue(type.name);
    component.addType();
    tick();

    expect(globalModuleMock.httpCenter.postInstallationType).toHaveBeenCalled();
    expect(snackbarServiceMock.openSnackBar).toHaveBeenCalledWith('Añadido exitosamente...');
  }));

  it('should handle add administrative area', fakeAsync(() => {
    const area = { name: 'New Area' };
    component.form.get('adminAreaName')?.setValue(area.name);
    component.addArea();
    tick();

    expect(globalModuleMock.httpCenter.postAdminArea).toHaveBeenCalled();
    expect(snackbarServiceMock.openSnackBar).toHaveBeenCalledWith('Añadido exitosamente...');
  }));

  it('should filter past dates correctly', () => {
    const today = new Date();
    const pastDate = new Date(today.getFullYear() - 1, today.getMonth(), today.getDate());
    const futureDate = new Date(today.getFullYear() + 1, today.getMonth(), today.getDate());

    expect(component.filterDate(pastDate)).toBeTrue();
    expect(component.filterDate(futureDate)).toBeFalse();
  });

  it('should update formula correctly', () => {
    const initialOptions = component.options();
    component.updateFormula();

    expect(component.form.get('formula')?.value).toBe(initialOptions.map(opt => opt.name).join(' '));
  });

  it('should handle close modal and form reset', () => {
    const formResetSpy = spyOn(component.form, 'reset');
    component.onCloseModal();

    expect(formResetSpy).toHaveBeenCalled();
    expect(component.enableAddArea).toBeFalse();
    expect(component.enableAddType).toBeFalse();
  });
  afterEach(() => {
    // Cleanup
  });
});
