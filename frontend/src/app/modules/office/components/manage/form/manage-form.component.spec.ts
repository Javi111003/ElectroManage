import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageFormComponent } from './manage-form.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { GlobalModule } from '../../../../global/global.module';
import { DataService } from '../../../../../services/data/data.service';
import { OfficeService } from '../../../../../services/office/office.service';
import { BehaviorSubject, of } from 'rxjs';
import { SharedModule } from '../../../../../shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ManageFormOfficeComponent', () => {
  let component: ManageFormComponent;
  let fixture: ComponentFixture<ManageFormComponent>;
  let globalModuleMock: any;
  let dataServiceMock: jasmine.SpyObj<DataService>;

  beforeEach(async () => {
    globalModuleMock = {
      Reset: jasmine.createSpy('Reset'),
      getWorkCenters: jasmine.createSpy('getWorkCenters'),
      getUserInfo: jasmine.createSpy('getUserInfo').and.returnValue({
        roles: ['User'],
        info: { company: { id: 1, name: 'Test Company' } }
      })
    };

    dataServiceMock = jasmine.createSpyObj('DataService', ['setData']);
    Object.defineProperty(dataServiceMock, 'currentData', {
      get: () => new BehaviorSubject<any>(null)
    });

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
        { provide: OfficeService, useValue: { postOffice: () => of({}) } }
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
    expect(component.form.get('officeName')).toBeTruthy();
    expect(component.form.get('description')).toBeTruthy();
    expect(component.form.get('workCenter')).toBeTruthy();
  });

  it('should mark form as invalid when empty', () => {
    expect(component.form.valid).toBeFalsy();
  });

  it('should be valid when all required fields are filled', () => {
    component.form.patchValue({
      officeName: 'Test Office',
      description: 'Test Description',
      workCenter: { id: 1, name: 'Test Center' }
    });
    expect(component.form.valid).toBeTruthy();
  });
});
