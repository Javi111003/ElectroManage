// import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
// import { RegisterFormComponent } from './register-form.component';
// import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { GlobalModule } from '../../../../global/global.module';
// import { DataService } from '../../../../../services/data/data.service';
// import { SnackbarService } from '../../../../../services/snackbar/snackbar.service';
// import { RegisterService } from '../../../../../services/register/register.service';
// import { of, BehaviorSubject } from 'rxjs';
// import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatNativeDateModule } from '@angular/material/core';

// describe('RegisterFormComponent', () => {
//   let component: RegisterFormComponent;
//   let fixture: ComponentFixture<RegisterFormComponent>;
//   let globalModuleMock: any;
//   let dataServiceMock: jasmine.SpyObj<DataService>;
//   let snackbarServiceMock: jasmine.SpyObj<SnackbarService>;
//   let registerServiceMock: jasmine.SpyObj<RegisterService>;

//   const mockRegisterResponse = {
//     id: 1,
//     consumption: 100.5,
//     date: '2024-02-20'
//   };

//   beforeEach(async () => {
//     globalModuleMock = {
//       getUserInfo: jasmine.createSpy('getUserInfo').and.returnValue({
//         roles: ['Admin'],
//         info: { company: { id: 1, name: 'Test Company' } }
//       }),
//       openDialog: jasmine.createSpy('openDialog').and.returnValue(of(true)),
//       formatLocalDate: jasmine.createSpy('formatLocalDate').and.returnValue('2024-02-20')
//     };

//     dataServiceMock = jasmine.createSpyObj('DataService', ['setData', 'notifyDataUpdated']);
//     Object.defineProperty(dataServiceMock, 'currentData', {
//       value: new BehaviorSubject<any>([
//         null,
//         { id: 1, name: 'Test Center' },
//         true,
//         false
//       ])
//     });

//     snackbarServiceMock = jasmine.createSpyObj('SnackbarService', ['openSnackBar']);
//     registerServiceMock = jasmine.createSpyObj('RegisterService', ['postRegister', 'editRegister']);
    
//     registerServiceMock.postRegister.and.returnValue(of(mockRegisterResponse));
//     registerServiceMock.editRegister.and.returnValue(of(mockRegisterResponse));

//     await TestBed.configureTestingModule({
//       declarations: [RegisterFormComponent],
//       imports: [
//         ReactiveFormsModule,
//         BrowserAnimationsModule,
//         MatDatepickerModule,
//         MatNativeDateModule
//       ],
//       providers: [
//         FormBuilder,
//         { provide: GlobalModule, useValue: globalModuleMock },
//         { provide: DataService, useValue: dataServiceMock },
//         { provide: SnackbarService, useValue: snackbarServiceMock },
//         { provide: RegisterService, useValue: registerServiceMock }
//       ],
//       schemas: [CUSTOM_ELEMENTS_SCHEMA]
//     }).compileComponents();

//     fixture = TestBed.createComponent(RegisterFormComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   // it('should initialize form with company values for non-admin user', () => {
//   //   globalModuleMock.getUserInfo.and.returnValue({
//   //     roles: ['User'],
//   //     info: { company: { id: 1, name: 'Test Company' } }
//   //   });

//   //   const newComponent = new RegisterFormComponent(
//   //     TestBed.inject(FormBuilder),
//   //     globalModuleMock,
//   //     dataServiceMock,
//   //     snackbarServiceMock,
//   //     registerServiceMock
//   //   );

//   //   expect(newComponent.form.get('workCenter')?.value).toBe('Test Company');
//   // });

//   // it('should handle form submission with invalid form', () => {
//   //   component.form.patchValue({
//   //     workCenter: '',
//   //     consumption: null,
//   //     date: null
//   //   });

//   //   component.onSubmit();
    
//   //   expect(globalModuleMock.openDialog).toHaveBeenCalledWith('Por favor, rellene todos los campos.');
//   //   expect(component.loading).toBeTrue();
//   // });

//   it('should handle form submission for new register', fakeAsync(() => {
//     const testData = {
//       workCenter: { id: 1, name: 'Test Center' },
//       consumption: 100.5,
//       date: new Date('2024-02-20')
//     };

//     component.form.patchValue(testData);
//     component.postMethod = true;
//     component.onSubmit();
//     tick();

//     expect(registerServiceMock.postRegister).toHaveBeenCalled();
//     expect(snackbarServiceMock.openSnackBar).toHaveBeenCalledWith('Añadido exitosamente...');
//   }));

//   it('should handle form submission for edit register', fakeAsync(() => {
//     const testData = {
//       workCenter: { id: 1, name: 'Test Center' },
//       consumption: 100.5,
//       date: new Date('2024-02-20')
//     };

//     component.form.patchValue(testData);
//     component.postMethod = false;
//     component.data = { id: 1 };
//     component.onSubmit();
//     tick();

//     expect(registerServiceMock.editRegister).toHaveBeenCalled();
//     expect(snackbarServiceMock.openSnackBar).toHaveBeenCalledWith('Editado exitosamente...');
//   }));

//   it('should filter past dates correctly', () => {
//     const today = new Date();
//     const yesterday = new Date(today);
//     yesterday.setDate(today.getDate() - 1);
//     const tomorrow = new Date(today);
//     tomorrow.setDate(today.getDate() + 1);

//     expect(component.filterDate(yesterday)).toBeTrue();
//     expect(component.filterDate(tomorrow)).toBeFalse();
//   });

//   it('should mark all controls as touched on invalid submit', () => {
//     component.form.patchValue({
//       workCenter: '',
//       consumption: null,
//       date: null
//     });

//     component.onSubmit();

//     Object.keys(component.form.controls).forEach(key => {
//       expect(component.form.get(key)?.touched).toBeTrue();
//     });
//   });

//   afterEach(() => {
//     // Cleanup
//   });
// });
