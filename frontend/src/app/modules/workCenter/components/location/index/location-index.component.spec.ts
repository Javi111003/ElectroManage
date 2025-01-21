import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocationComponent } from './location-index.component';
import { GlobalModule } from '../../../../global/global.module';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { WorkCenterService } from '../../../../../services/workCenter/work-center.service';
import { of } from 'rxjs';
import { CenterDetails } from '../../../../../models/workCenter.interface';
import { SharedModule } from '../../../../../shared/shared.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

describe('LocationComponent', () => {
  let component: LocationComponent;
  let fixture: ComponentFixture<LocationComponent>;
  let workCenterServiceMock: jasmine.SpyObj<WorkCenterService>;
  let globalModuleMock: jasmine.SpyObj<GlobalModule>;

  const mockCenterData: CenterDetails[] = [
    {
      id: 1,
      name: 'Centro 1',
      location: {
        id: 1,
        addressDetails: 'Dirección 1',
        coordenateDTO: { 
          latitude: 22, 
          longitude: -80 
        }
      },
      administrativeArea: { 
        id: 1, 
        name: 'Área 1', 
        description: 'Descripción de Área 1' 
      },
      installationType: { 
        id: 1, 
        name: 'Tipo 1', 
        description: 'Descripción de Tipo 1' 
      },
      consumptionLimit: 1000,
      status: 'ACTIVE',
      managementTeam: { 
        id: 1, 
        teamName: 'Team 1', 
        companyId: 1, 
        members: [] 
      }
    }
  ];

  beforeEach(async () => {
    workCenterServiceMock = jasmine.createSpyObj('WorkCenterService', ['getCenterDetailsList']);
    globalModuleMock = jasmine.createSpyObj('GlobalModule', ['Reset', 'getWorkCenters', 'openDialog']);
    workCenterServiceMock.getCenterDetailsList.and.returnValue(of(mockCenterData));
    await TestBed.configureTestingModule({
      declarations: [LocationComponent],
      imports: [
        ReactiveFormsModule,
        SharedModule,
        BrowserAnimationsModule // Agregamos BrowserAnimationsModule aquí
      ],
      providers: [
        FormBuilder,
        { provide: WorkCenterService, useValue: workCenterServiceMock },
        { provide: GlobalModule, useValue: globalModuleMock }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(LocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize form with empty workCenter control', () => {
    expect(component.form.get('workCenter')).toBeTruthy();
    expect(component.form.get('workCenter')?.value).toBe('');
  });
  it('should load center details on init', () => {
    component.getCenterDetailsList();
    expect(component.centerLocationData).toEqual(mockCenterData);
  });

  it('should get form control value correctly', () => {
    component.form.get('workCenter')?.setValue('test');
    expect(component.getControlValue('workCenter')).toBe('test');
  });

  it('should show dialog when no work center is selected', () => {
    component.form.get('workCenter')?.setValue({ name: '' });
    component.onLocateClick();
    expect(globalModuleMock.openDialog).toHaveBeenCalledWith('Por favor, selecciona un Centro de Trabajo');
  });

  it('should handle valid work center selection', () => {
    const mockCenter = { id: 1, name: 'Centro 1' };
    component.form.get('workCenter')?.setValue(mockCenter);
    spyOn(component, 'showCenterLocation');
    
    component.onLocateClick();
    
    expect(component.showCenterLocation).toHaveBeenCalledWith(1);
  });
});
