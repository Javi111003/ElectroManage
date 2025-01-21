import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageComponent } from './manage.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { GlobalModule } from '../../../../global/global.module';
import { DataService } from '../../../../../services/data/data.service';
import { SnackbarService } from '../../../../../services/snackbar/snackbar.service';
import { BehaviorSubject, Subject, of } from 'rxjs';
import { SharedModule } from '../../../../../shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { ManageFormComponent } from '../../../components/manage/form/manage-form.component';
import { MatNativeDateModule } from '@angular/material/core';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { OfficeService } from '../../../../../services/office/office.service';

describe('ManageOfficeComponent', () => {
  let component: ManageComponent;
  let fixture: ComponentFixture<ManageComponent>;
  let globalModuleMock: any;
  let dataServiceMock: jasmine.SpyObj<DataService>;
  let snackbarServiceMock: jasmine.SpyObj<SnackbarService>;
  let dataUpdatedSubject: Subject<void>;

  beforeEach(async () => {
    dataUpdatedSubject = new Subject<void>();

    // Mock del GlobalModule
    globalModuleMock = {
      openDialog: jasmine.createSpy('openDialog').and.returnValue(of(true)),
      Reset: jasmine.createSpy('Reset'),
      getWorkCenters: jasmine.createSpy('getWorkCenters'),
      getOfficesByCenter: jasmine.createSpy('getOfficesByCenter').and.returnValue(of([])),
      getUserInfo: jasmine.createSpy('getUserInfo').and.returnValue({
        roles: ['User'],
        info: {
          company: { id: 1, name: 'Test Company' }
        }
      }),
      httpOffice: {
        deleteOffice: jasmine.createSpy('deleteOffice').and.returnValue(of({}))
      }
    };

    // Mock del DataService
    dataServiceMock = jasmine.createSpyObj('DataService', ['setData', 'notifyDataUpdated']);
    Object.defineProperty(dataServiceMock, 'dataUpdated$', {
      get: () => dataUpdatedSubject.asObservable()
    });
    Object.defineProperty(dataServiceMock, 'currentData', {
      get: () => new BehaviorSubject<any>(null)
    });

    // Mock del SnackbarService
    snackbarServiceMock = jasmine.createSpyObj('SnackbarService', ['openSnackBar']);

    await TestBed.configureTestingModule({
      declarations: [
         ManageComponent,
         ManageFormComponent 
      ],
      imports: [
        ReactiveFormsModule,
        SharedModule,
        MatTableModule,
        BrowserAnimationsModule,
        HttpClientTestingModule
      ],
      providers: [
        FormBuilder,
        OfficeService,
        { provide: GlobalModule, useValue: globalModuleMock },
        { provide: DataService, useValue: dataServiceMock },
        { provide: SnackbarService, useValue: snackbarServiceMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with empty table data', () => {
    expect(component.dataSource.data.length).toBe(0);
    expect(component.showTable).toBeFalse();
  });

  it('should call Reset and getWorkCenters on init', () => {
    component.ngOnInit();
    expect(globalModuleMock.Reset).toHaveBeenCalled();
    expect(globalModuleMock.getWorkCenters).toHaveBeenCalled();
  });

  it('should handle delete office', () => {
    const testOffice = { id: 1 };
    component.delete(testOffice);
    expect(globalModuleMock.openDialog).toHaveBeenCalledWith(
      '¿Estás seguro de que deseas continuar?',
      true
    );
  });

  it('should handle consult click with valid work center', () => {
    component.form.get('workCenter')?.setValue({ id: 1, name: 'Test Center' });
    component.onConsultClick();
    expect(component.showTable).toBeTrue();
  });

  it('should show dialog when consulting without valid work center', () => {
    component.form.get('workCenter')?.setValue('');
    component.onConsultClick();
    expect(globalModuleMock.openDialog).toHaveBeenCalledWith(
      'Por favor, selecciona un Centro de Trabajo válido.'
    );
  });

  it('should reload table data correctly', () => {
    const testOffices = [
      { id: 1, name: 'Office 1', description: 'Desc 1' },
      { id: 2, name: 'Office 2', description: 'Desc 2' }
    ];
    component.reloadTableData(testOffices);
    expect(component.dataSource.data.length).toBe(2);
    expect(component.noResults).toBeFalse();
  });

  it('should set noResults to true when empty data', () => {
    component.reloadTableData([]);
    expect(component.noResults).toBeTrue();
  });

  it('should update data when notified', () => {
    component.form.get('workCenter')?.setValue({ id: 1, name: 'Test Center' });
    dataUpdatedSubject.next();
    expect(globalModuleMock.getOfficesByCenter).toHaveBeenCalledWith(1);
  });

  it('should handle successful office deletion', () => {
    const testOffice = { id: 1 };
    component.delete(testOffice);
    expect(globalModuleMock.httpOffice.deleteOffice).toHaveBeenCalledWith(1);
    expect(snackbarServiceMock.openSnackBar).toHaveBeenCalledWith('Eliminado exitosamente...');
  });
});
