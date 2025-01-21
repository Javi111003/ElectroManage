import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ComparisonComponent } from './comparison.component';
import { GlobalModule } from '../../../../global/global.module';
import { PolicyService } from '../../../../../services/policy/policy.service';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialogModule } from '@angular/material/dialog';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

describe('ComparisonComponent', () => {
  let component: ComparisonComponent;
  let fixture: ComponentFixture<ComparisonComponent>;
  let policyService: PolicyService;
  let globalModule: GlobalModule;

  // Actualizar el mock de datos para GlobalModule
  const mockUserInfo = {
    roles: ['User'],
    company: {  // Cambiar info.company por company directamente
      id: 1,
      name: 'Test Company'
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ComparisonComponent],
      imports: [
        ReactiveFormsModule,
        HttpClientTestingModule,
        MatDialogModule,
        BrowserAnimationsModule
      ],
      providers: [
        FormBuilder,
        {
          provide: GlobalModule,
          useValue: {
            getUserInfo: () => mockUserInfo,
            getWorkCenters: () => {},
            Reset: () => {},
            openDialog: () => of(true),  // Añadir retorno de Observable
            httpPolicy: {
              getPoliciesByCenter: () => of([])  // Añadir mock para getPoliciesByCenter
            }
          }
        },
        PolicyService
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ComparisonComponent);
    component = fixture.componentInstance;
    policyService = TestBed.inject(PolicyService);
    globalModule = TestBed.inject(GlobalModule);

    // Mock para PolicyService
    spyOn(policyService, 'getPoliciesByCenter').and.returnValue(of([]));

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Prueba adicional para verificar la inicialización correcta
  it('should initialize with correct user info', () => {
    expect(component.form.get('workCenter')?.value).toBeDefined();
    expect(component.form.get('policy')).toBeDefined();
  });
});
