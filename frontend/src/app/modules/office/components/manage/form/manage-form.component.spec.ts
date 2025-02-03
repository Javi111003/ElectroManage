// import { ComponentFixture, TestBed } from '@angular/core/testing';
// import { ManageFormComponent } from './manage-form.component';
// import { FormBuilder, ReactiveFormsModule } from '@angular/forms';
// import { GlobalModule } from '../../../../global/global.module';
// import { DataService } from '../../../../../services/data/data.service';
// import { OfficeService } from '../../../../../services/office/office.service';
// import { BehaviorSubject, of } from 'rxjs';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { Component, Input } from '@angular/core';
// import { ButtonComponent } from '../../../../../shared/components/button/button.component';

// // Crear un componente stub para Autocomplete
// @Component({
//   selector: 'app-autocomplete',
//   template: '<div>Mock Autocomplete</div>'
// })
// class MockAutocompleteComponent {
//   @Input() label: string = '';
//   @Input() control: any;
//   @Input() options: any[] = [];
//   @Input() required: boolean = false;
//   @Input() isDisabled: boolean = false;  // Agregar esta línea
//   @Input() loading: boolean = false;     // Agregar esta línea si también se usa
// }

// // Crear un componente stub para Button
// @Component({
//   selector: 'app-button',
//   template: '<button>Mock Button</button>'
// })
// class MockButtonComponent {
//   @Input() text: string = '';
//   @Input() type: string = 'button';
//   @Input() disabled: boolean = false;
//   @Input() loading: boolean = false;
//   @Input() label: string = '';  // Agregar esta línea
//   @Input() id: string = '';     // Agregar esta línea si también se usa
//   @Input() class: string = '';  // Agregar esta línea si también se usa
// }

// describe('ManageFormOfficeComponent', () => {
//   let component: ManageFormComponent;
//   let fixture: ComponentFixture<ManageFormComponent>;
//   let globalModuleMock: any;
//   let dataServiceMock: jasmine.SpyObj<DataService>;

//   beforeEach(async () => {
//     globalModuleMock = {
//       Reset: jasmine.createSpy('Reset'),
//       getWorkCenters: jasmine.createSpy('getWorkCenters'),
//       getUserInfo: jasmine.createSpy('getUserInfo').and.returnValue({
//         roles: ['User'],
//         company: { // Cambiar info.company por company directamente
//           id: 1,
//           name: 'Test Company'
//         }
//       }),
//       openDialog: jasmine.createSpy('openDialog').and.returnValue(of(true)),
//       getControl: jasmine.createSpy('getControl').and.returnValue({
//         setValue: jasmine.createSpy('setValue'),
//         value: ''
//       }),
//       getControlValue: jasmine.createSpy('getControlValue').and.returnValue('')
//     };

//     dataServiceMock = jasmine.createSpyObj('DataService', ['setData']);
//     Object.defineProperty(dataServiceMock, 'currentData', {
//       get: () => new BehaviorSubject<any>(null)
//     });

//     await TestBed.configureTestingModule({
//       declarations: [ 
//         ManageFormComponent,
//         MockAutocompleteComponent,
//         ButtonComponent
//       ],
//       imports: [ 
//         ReactiveFormsModule, 
//         BrowserAnimationsModule  
//       ],
//       providers: [
//         FormBuilder,
//         { provide: GlobalModule, useValue: globalModuleMock },
//         { provide: DataService, useValue: dataServiceMock },
//         { provide: OfficeService, useValue: { postOffice: () => of({}) } }
//       ]
//     }).compileComponents();

//     fixture = TestBed.createComponent(ManageFormComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should initialize form with default values', () => {
//     expect(component.form.get('officeName')).toBeTruthy();
//     expect(component.form.get('description')).toBeTruthy();
//     expect(component.form.get('workCenter')).toBeTruthy();
//   });

//   it('should mark form as invalid when empty', () => {
//     expect(component.form.valid).toBeFalsy();
//   });

//   it('should be valid when all required fields are filled', () => {
//     component.form.patchValue({
//       officeName: 'Test Office',
//       description: 'Test Description',
//       workCenter: { id: 1, name: 'Test Center' }
//     });
//     expect(component.form.valid).toBeTruthy();
//   });
// });
