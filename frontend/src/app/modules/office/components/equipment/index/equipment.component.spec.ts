import { ComponentFixture, TestBed } from '@angular/core/testing';
import { EquipmentComponent } from './equipment.component';
import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { GlobalModule } from '../../../../global/global.module';
import { DataService } from '../../../../../services/data/data.service';
import { SnackbarService } from '../../../../../services/snackbar/snackbar.service';
import { SharedModule } from '../../../../../shared/shared.module';
import { EquipmentFormComponent } from '../../../../office/components/equipment/form/equipment-form.component';
import { of, Subject, BehaviorSubject } from 'rxjs';
import { HttpClientModule } from '@angular/common/http';
import { ButtonComponent } from '../../../../../shared/components/button/button.component';
import { ShowForRolesDirective } from '../../../../../directives/showForRoles/show-for-roles.directive';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('EquipmentComponent', () => {
  let component: EquipmentComponent;
  let fixture: ComponentFixture<EquipmentComponent>;
  let globalModuleMock: any;
  let dataServiceMock: jasmine.SpyObj<DataService>;
  let snackbarServiceMock: jasmine.SpyObj<SnackbarService>;

  beforeEach(async () => {
    globalModuleMock = {
      Reset: jasmine.createSpy('Reset'),
      getWorkCenters: jasmine.createSpy('getWorkCenters'),
      getOfficesByCenter: jasmine.createSpy('getOfficesByCenter').and.returnValue(of([])),
      getUserInfo: jasmine.createSpy('getUserInfo').and.returnValue({
        roles: ['Admin'], // Cambiar a Admin para evitar la asignación automática
        info: { company: { id: 1, name: 'Test Company' } }
      }),
      openDialog: jasmine.createSpy('openDialog').and.returnValue(of(true)),
      offices: [],
      httpOffice: {
        getEquipmentList: jasmine.createSpy('getEquipmentList').and.returnValue(of([])),
        deleteEquipmentInstance: jasmine.createSpy('deleteEquipmentInstance').and.returnValue(of({})),
        deleteEquipmentSpecification: jasmine.createSpy('deleteEquipmentSpecification').and.returnValue(of({}))
      }
    };

    dataServiceMock = jasmine.createSpyObj('DataService', ['setData', 'notifyDataUpdated']);
    // Configurar tanto dataUpdated$ como currentData
    Object.defineProperty(dataServiceMock, 'dataUpdated$', {
      get: () => new Subject().asObservable()
    });
    Object.defineProperty(dataServiceMock, 'currentData', {
      get: () => new BehaviorSubject<any>([
        null,
        { id: 1, name: 'Test Center' },
        { id: 1, name: 'Test Office' },
        true
      ])
    });

    snackbarServiceMock = jasmine.createSpyObj('SnackbarService', ['openSnackBar']);

    await TestBed.configureTestingModule({
      declarations: [ 
        EquipmentComponent,
        EquipmentFormComponent,
        ButtonComponent,
        ShowForRolesDirective
      ],
      imports: [ 
        ReactiveFormsModule,
        BrowserAnimationsModule,
        SharedModule,
        HttpClientModule
      ],
      providers: [
        FormBuilder,
        { provide: GlobalModule, useValue: globalModuleMock },
        { provide: DataService, useValue: dataServiceMock },
        { provide: SnackbarService, useValue: snackbarServiceMock }
      ],
      schemas: [ CUSTOM_ELEMENTS_SCHEMA ]
    }).compileComponents();

    fixture = TestBed.createComponent(EquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Actualizar el test de inicialización
  it('should initialize form with empty values for admin user', () => {
    // Asegurarse que es un usuario admin
    globalModuleMock.getUserInfo.and.returnValue({
      roles: ['Admin'],
      info: { company: { id: 1, name: 'Test Company' } }
    });

    // Recrear el componente para que use la nueva configuración
    fixture = TestBed.createComponent(EquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.form.get('workCenter')?.value).toBe('');
    expect(component.form.get('office')?.value).toBe('');
  });

  // Agregar test para usuario no admin
  it('should initialize form with company values for non-admin user', () => {
    // Configurar como usuario no admin
    globalModuleMock.getUserInfo.and.returnValue({
      roles: ['User'],
      info: { company: { id: 1, name: 'Test Company' } }
    });

    // Recrear el componente
    fixture = TestBed.createComponent(EquipmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    expect(component.form.get('workCenter')?.value).toEqual({
      id: 1,
      name: 'Test Company'
    });
  });

  it('should call Reset and getWorkCenters on init without errors', () => {
    expect(() => {
      component.ngOnInit();
    }).not.toThrow();
    expect(globalModuleMock.Reset).toHaveBeenCalled();
    expect(globalModuleMock.getWorkCenters).toHaveBeenCalled();
  });

  it('should show error dialog when consulting without selections', () => {
    component.onConsultClick();
    expect(globalModuleMock.openDialog).toHaveBeenCalledWith(
      'Por favor, selecciona un Centro de Trabajo y una Oficina válidos.'
    );
  });

  it('should set data and show table when valid selections are made', () => {
    component.form.patchValue({
      workCenter: { id: 1, name: 'Test Center' },
      office: { id: 1, name: 'Test Office' }
    });
    component.onConsultClick();
    expect(component.showTable).toBeTrue();
  });

  // Modificar la prueba de getOfficesByCenter
  it('should call getOfficesByCenter when work center changes', () => {
    // Configurar el valor del centro de trabajo
    component.form.patchValue({
      workCenter: { id: 1, name: 'Test Center' }
    });

    // La llamada a getOfficesByCenter debería ocurrir debido al valueChanges subscription
    expect(globalModuleMock.getOfficesByCenter).toHaveBeenCalledWith(1);
  });

  it('should call getOfficesByCenter for non-admin users on initialization', () => {
    // Limpiar las llamadas previas al spy
    globalModuleMock.getOfficesByCenter.calls.reset();
    
    // Configurar como usuario no admin
    globalModuleMock.getUserInfo.and.returnValue({
      roles: ['User'],
      info: { company: { id: 1, name: 'Test Company' } }
    });

    // Crear una nueva instancia del componente
    const newComponent = new EquipmentComponent(
      TestBed.inject(FormBuilder),
      globalModuleMock,
      dataServiceMock,
      snackbarServiceMock
    );

    // Verificar que getOfficesByCenter fue llamado con el ID correcto
    expect(globalModuleMock.getOfficesByCenter).toHaveBeenCalledWith(1);
  });
});
