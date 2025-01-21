import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { ManageFormComponent } from './manage-form.component';
import { DataService } from '../../../../../services/data/data.service';
import { PolicyService } from '../../../../../services/policy/policy.service';
import { SnackbarService } from '../../../../../services/snackbar/snackbar.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GlobalModule } from '../../../../global/global.module';
import { of, Subject } from 'rxjs';

describe('ManagePolicyFormComponent', () => {
  let component: ManageFormComponent;
  let fixture: ComponentFixture<ManageFormComponent>;
  let dataServiceSpy: jasmine.SpyObj<DataService>;
  let policyServiceSpy: jasmine.SpyObj<PolicyService>;
  let snackbarServiceSpy: jasmine.SpyObj<SnackbarService>;

  beforeEach(async () => {
    const dataServiceMock = {
      setData: jasmine.createSpy('setData'),
      currentData: new Subject(),
      notifyDataUpdated: jasmine.createSpy('notifyDataUpdated')
    };

    const policyService = jasmine.createSpyObj('PolicyService', ['postPolicy', 'editPolicy']);
    const snackbarService = jasmine.createSpyObj('SnackbarService', ['openSnackBar']);

    await TestBed.configureTestingModule({
      declarations: [ ManageFormComponent ],
      imports: [ 
        ReactiveFormsModule,
        BrowserAnimationsModule,
        GlobalModule
      ],
      providers: [
        FormBuilder,
        { provide: DataService, useValue: dataServiceMock },
        { provide: PolicyService, useValue: policyService },
        { provide: SnackbarService, useValue: snackbarService }
      ]
    }).compileComponents();

    dataServiceSpy = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;
    policyServiceSpy = TestBed.inject(PolicyService) as jasmine.SpyObj<PolicyService>;
    snackbarServiceSpy = TestBed.inject(SnackbarService) as jasmine.SpyObj<SnackbarService>;

    fixture = TestBed.createComponent(ManageFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty values', () => {
    expect(component.form.get('policyName')?.value).toBe('');
    expect(component.form.get('description')?.value).toBe('');
  });
});
