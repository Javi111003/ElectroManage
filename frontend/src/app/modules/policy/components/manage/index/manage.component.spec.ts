import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ManageComponent } from './manage.component';
import { GlobalModule } from '../../../../global/global.module';
import { PolicyService } from '../../../../../services/policy/policy.service';
import { DataService } from '../../../../../services/data/data.service';
import { MatTableModule } from '@angular/material/table';
import { SharedModule } from '../../../../../shared/shared.module';
import { WorkCenterModule } from '../../../../workCenter/workCenter.module';
import { PolicyModule } from '../../../policy.module';
import { of } from 'rxjs';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('ManagePolicyComponent', () => {
  let component: ManageComponent;
  let fixture: ComponentFixture<ManageComponent>;
  let policyServiceSpy: jasmine.SpyObj<PolicyService>;
  let dataServiceSpy: jasmine.SpyObj<DataService>;
  let globalModuleSpy: jasmine.SpyObj<GlobalModule>;

  const mockPolicies = [
    {
      policyId: 1,
      policyName: 'Test Policy',
      description: 'Test Description',
      applyingDate: '2023-01-01'
    }
  ];

  beforeEach(async () => {
    const policyService = jasmine.createSpyObj('PolicyService', ['getPolicies', 'deletePolicy']);
    const dataService = jasmine.createSpyObj('DataService', ['setData', 'notifyDataUpdated']);
    const globalModule = jasmine.createSpyObj('GlobalModule', ['openDialog']);

    policyService.getPolicies.and.returnValue(of(mockPolicies));
    policyService.deletePolicy.and.returnValue(of({}));
    globalModule.openDialog.and.returnValue(of(true));
    dataService.dataUpdated$ = of(null);

    await TestBed.configureTestingModule({
      declarations: [ ManageComponent ],
      imports: [ 
        BrowserAnimationsModule,
        MatTableModule,
        SharedModule,
        WorkCenterModule,
        PolicyModule  
      ],
      providers: [
        { provide: PolicyService, useValue: policyService },
        { provide: DataService, useValue: dataService },
        { provide: GlobalModule, useValue: globalModule }
      ]
    }).compileComponents();

    policyServiceSpy = TestBed.inject(PolicyService) as jasmine.SpyObj<PolicyService>;
    dataServiceSpy = TestBed.inject(DataService) as jasmine.SpyObj<DataService>;
    globalModuleSpy = TestBed.inject(GlobalModule) as jasmine.SpyObj<GlobalModule>;

    fixture = TestBed.createComponent(ManageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should load policies on init', () => {
    component.ngOnInit();
    expect(policyServiceSpy.getPolicies).toHaveBeenCalled();
    expect(component.policyObjectArray).toEqual(mockPolicies);
    expect(component.dataSource.data.length).toBe(1);
  });

  it('should set data and open modal on add click', () => {
    // Mock bootstrap Modal
    (window as any).bootstrap = {
      Modal: class {
        show() {}
      }
    };

    component.onAddClick();
    expect(dataServiceSpy.setData).toHaveBeenCalledWith([null, true, false]);
  });

  it('should handle edit click', () => {
    const testItem = mockPolicies[0];
    // Mock bootstrap Modal
    (window as any).bootstrap = {
      Modal: class {
        show() {}
      }
    };

    component.edit(testItem);
    expect(dataServiceSpy.setData).toHaveBeenCalledWith([testItem, false, false]);
  });

  it('should handle delete confirmation and delete policy', () => {
    const testItem = { id: 1 };
    
    component.delete(testItem);
    
    expect(globalModuleSpy.openDialog).toHaveBeenCalled();
    expect(policyServiceSpy.deletePolicy).toHaveBeenCalledWith(1);
  });

  it('should reload table data correctly', () => {
    component.reloadTableData(mockPolicies);
    expect(component.dataSource.data.length).toBe(1);
    expect(component.dataSource.data[0]).toEqual({
      id: mockPolicies[0].policyId,
      policyName: mockPolicies[0].policyName,
      description: mockPolicies[0].description
    });
  });

  it('should unsubscribe on destroy', () => {
    const unsubscribeSpy = spyOn(component['subscriptions'], 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscribeSpy).toHaveBeenCalled();
  });
});
