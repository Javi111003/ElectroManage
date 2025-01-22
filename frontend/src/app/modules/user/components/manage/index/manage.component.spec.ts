declare var bootstrap: any;

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageComponent } from './manage.component';
import { UserService } from '../../../../../services/user/user.service';
import { DataService } from '../../../../../services/data/data.service';
import { SnackbarService } from '../../../../../services/snackbar/snackbar.service';
import { GlobalModule } from '../../../../global/global.module';
import { of, Subject, BehaviorSubject } from 'rxjs';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from '../../../../../shared/shared.module';
import { ManageFormComponent } from '../form/manage-form.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ManageUserComponent', () => {
  let component: ManageComponent;
  let fixture: ComponentFixture<ManageComponent>;
  let userServiceMock: jasmine.SpyObj<UserService>;
  let dataServiceMock: jasmine.SpyObj<DataService>;
  let snackbarServiceMock: jasmine.SpyObj<SnackbarService>;
  let dataUpdatedSubject: Subject<void>;
  let currentDataSubject: BehaviorSubject<any>;

  beforeEach(async () => {
    // Mock de bootstrap global
    (window as any).bootstrap = {
      Modal: class {
        constructor() { }
        show() { }
        hide() { }
      }
    };

    dataUpdatedSubject = new Subject<void>();
    currentDataSubject = new BehaviorSubject<any>(null);
    userServiceMock = jasmine.createSpyObj('UserService', ['getUsersList', 'deleteUser']);
    dataServiceMock = jasmine.createSpyObj('DataService', ['setData', 'notifyDataUpdated']);
    // Añadir tanto dataUpdated$ como currentData al mock
    Object.defineProperty(dataServiceMock, 'dataUpdated$', {
      get: () => dataUpdatedSubject.asObservable()
    });
    Object.defineProperty(dataServiceMock, 'currentData', {
      get: () => currentDataSubject.asObservable()
    });
    snackbarServiceMock = jasmine.createSpyObj('SnackbarService', ['openSnackBar']);

    userServiceMock.getUsersList.and.returnValue(of({ appUsers: [] }));
    userServiceMock.getUserById.and.returnValue(of({
      email: 'test@test.com',
      username: 'testuser',
      company: { id: 1, name: 'Test Company' },
      roles: ['USER']
    }));
    userServiceMock.deleteUser.and.returnValue(of({}));

    const globalModuleMock = {
      openDialog: () => of(true),
      Reset: jasmine.createSpy('Reset'),
      getWorkCenters: jasmine.createSpy('getWorkCenters')
    };

    await TestBed.configureTestingModule({
      declarations: [
        ManageComponent,
        ManageFormComponent
      ],
      imports: [
        SharedModule,
        MatTableModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: UserService, useValue: userServiceMock },
        { provide: DataService, useValue: dataServiceMock },
        { provide: SnackbarService, useValue: snackbarServiceMock },
        { provide: GlobalModule, useValue: globalModuleMock }
      ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load users on init', () => {
    component.ngOnInit();
    expect(userServiceMock.getUsersList).toHaveBeenCalled();
  });

  it('should handle delete user', () => {
    const testUser = { id: 1 };
    component.delete(testUser);
    expect(userServiceMock.deleteUser).toHaveBeenCalledWith(1);
  });

  it('should handle edit user', () => {
    const testUser = { id: 1, name: 'Test User' };
    component.edit(testUser);
    expect(userServiceMock.getUserById).toHaveBeenCalledWith(1);
  });

  it('should update data when notified', () => {
    spyOn(component, 'getUserList');
    dataUpdatedSubject.next();
    expect(component.getUserList).toHaveBeenCalled();
  });
});
