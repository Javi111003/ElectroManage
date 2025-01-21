import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ManageComponent } from './manage.component';
import { GlobalModule } from '../../../../global/global.module';
import { DataService } from '../../../../../services/data/data.service';
import { SnackbarService } from '../../../../../services/snackbar/snackbar.service';
import { MatTableModule } from '@angular/material/table';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { SharedModule } from '../../../../../shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { WorkCenterModule } from '../../../workCenter.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { of, Subject } from 'rxjs';
import { CenterDetails } from '../../../../../models/workCenter.interface';

describe('ManageWorkCenterComponent', () => {
  let component: ManageComponent;
  let fixture: ComponentFixture<ManageComponent>;
  let globalModuleMock: any;
  let dataServiceMock: jasmine.SpyObj<DataService>;
  let snackbarServiceMock: jasmine.SpyObj<SnackbarService>;

  const mockCenterDetails: CenterDetails[] = [
    {
      id: 1,
      status: 'lol',
      name: 'Test Center',
      consumptionLimit: 1000,
      installationType: {
        id: 2,
        name: 'lol',
        description: 'lal'
      },
      administrativeArea: {
        id: 3,
        name: 'lal',
        description: 'lol'
      },
      location: {
        id: 1,
        addressDetails: 'Test Address',
        coordenateDTO: {
          latitude: 22,
          longitude: -80
        }
      },
      managementTeam: {
        id: 1,
        teamName: 'Test Team',
        companyId: 1,
        members: [
          {
            userId: 2,
            userName: 'lol'
          }
        ]
      },
      currentEfficiencyPolicy: {
        efficiencyPolicy: {
          policyId: 1,
          policyName: 'Test Policy',
          description: 'Test Description'
        },
        applyingDate: '2023-01-01',
        to: '2023-12-31'
      }
    }
  ];

  beforeEach(async () => {
    globalModuleMock = {
      getUserInfo: jasmine.createSpy('getUserInfo').and.returnValue({
        roles: ['Admin'],
        info: { company: { id: 1, name: 'Test Company' } }
      }),
      openDialog: jasmine.createSpy('openDialog').and.returnValue(of(true)),
      httpCenter: {
        getCenterDetailsList: jasmine.createSpy('getCenterDetailsList').and.returnValue(of(mockCenterDetails)),
        getCenterById: jasmine.createSpy('getCenterById').and.returnValue(of(mockCenterDetails[0])),
        deleteCenter: jasmine.createSpy('deleteCenter').and.returnValue(of({})),
        deletelocation: jasmine.createSpy('deletelocation').and.returnValue(of({})),
        deleteManagementTeam: jasmine.createSpy('deleteManagementTeam').and.returnValue(of({}))
      }
    };

    dataServiceMock = jasmine.createSpyObj('DataService', ['setData', 'notifyDataUpdated']);
    Object.defineProperty(dataServiceMock, 'dataUpdated$', {
      get: () => new Subject().asObservable()
    });

    snackbarServiceMock = jasmine.createSpyObj('SnackbarService', ['openSnackBar']);

    await TestBed.configureTestingModule({
      declarations: [ManageComponent],
      imports: [
        MatTableModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: GlobalModule, useValue: globalModuleMock },
        { provide: DataService, useValue: dataServiceMock },
        { provide: SnackbarService, useValue: snackbarServiceMock }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should handle delete click with full cascade', fakeAsync(() => {
    const testCenter = {
      id: 1,
      location: { id: 1 },
      managementTeam: { companyId: 1, id: 1 }
    };

    component.delete(testCenter);
    tick();

    expect(globalModuleMock.openDialog).toHaveBeenCalled();
    expect(globalModuleMock.httpCenter.deleteCenter).toHaveBeenCalledWith(1);
    expect(globalModuleMock.httpCenter.deletelocation).toHaveBeenCalledWith(1);
    expect(globalModuleMock.httpCenter.deleteManagementTeam).toHaveBeenCalledWith(1, 1);
    expect(snackbarServiceMock.openSnackBar).toHaveBeenCalledWith('Eliminado exitosamente...');
  }));

  it('should reload table data correctly', () => {
    component.reloadTableData(mockCenterDetails);
    
    expect(component.dataSource.data.length).toBe(1);
    expect(component.dataSource.data[0].name).toBe('Test Center');
    expect(component.noResults).toBeFalse();
  });

  it('should handle get centers', fakeAsync(() => {
    component.getCenters();
    tick();

    expect(globalModuleMock.httpCenter.getCenterDetailsList).toHaveBeenCalled();
    expect(component.centerObjectArray).toEqual(mockCenterDetails);
  }));

  it('should handle get manager center', fakeAsync(() => {
    component.getManagerCenter(1);
    tick();

    expect(globalModuleMock.httpCenter.getCenterById).toHaveBeenCalledWith(1);
    expect(component.centerObjectArray).toEqual([mockCenterDetails[0]]);
  }));

  it('should handle delete location', fakeAsync(() => {
    const testCenter = {
      location: { id: 1 },
      managementTeam: { companyId: 1, id: 1 }
    };

    component.deleteLocation(testCenter);
    tick();

    expect(globalModuleMock.httpCenter.deletelocation).toHaveBeenCalledWith(1);
    expect(globalModuleMock.httpCenter.deleteManagementTeam).toHaveBeenCalledWith(1, 1);
  }));

  it('should handle delete team', fakeAsync(() => {
    component.deleteTeam(1, 1);
    tick();

    expect(globalModuleMock.httpCenter.deleteManagementTeam).toHaveBeenCalledWith(1, 1);
  }));

  afterEach(() => {
    // Cleanup
  });
});
