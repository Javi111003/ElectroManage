// import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
// import { ExcessComponent } from './excess.component';
// import { FormBuilder, ReactiveFormsModule, FormsModule } from '@angular/forms';
// import { GlobalModule } from '../../../../global/global.module';
// import { HttpClientTestingModule } from '@angular/common/http/testing';
// import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
// import { MatDatepickerModule } from '@angular/material/datepicker';
// import { MatNativeDateModule } from '@angular/material/core';
// import { MatFormFieldModule } from '@angular/material/form-field';
// import { MatInputModule } from '@angular/material/input';
// import { MatTableModule } from '@angular/material/table';
// import { ButtonComponent } from '../../../../../shared/components/button/button.component';
// import { TableComponent } from '../../../../../shared/components/table/table.component';
// import { MatPaginatorModule } from '@angular/material/paginator';
// import { MatIconModule } from '@angular/material/icon';
// import { of } from 'rxjs';
// import { Moment } from 'moment';
// import moment from 'moment'; // Cambiar la importación de moment
// import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

// describe('ExcessComponent', () => {
//   let component: ExcessComponent;
//   let fixture: ComponentFixture<ExcessComponent>;
//   let globalModuleMock: any;

//   const mockExcessData = [
//     {
//       company: { name: 'Test Center' },
//       limit: 1000,
//       consumption: 1200,
//       exceeded: 200
//     }
//   ];

//   beforeEach(async () => {
//     globalModuleMock = {
//       openDialog: jasmine.createSpy('openDialog').and.returnValue(of(true)),
//       httpCenter: {
//         getExcess: jasmine.createSpy('getExcess').and.returnValue(of(mockExcessData))
//       }
//     };

//     await TestBed.configureTestingModule({
//       declarations: [
//         ExcessComponent,
//         ButtonComponent,
//         TableComponent,
//       ],
//       imports: [
//         ReactiveFormsModule,
//         FormsModule,
//         MatPaginatorModule, // Añadir este módulo
//         MatIconModule,
//         HttpClientTestingModule,
//         BrowserAnimationsModule,
//         MatDatepickerModule,
//         MatNativeDateModule,
//         MatFormFieldModule,
//         MatInputModule,
//         MatTableModule
//       ],
//       providers: [
//         FormBuilder,
//         { provide: GlobalModule, useValue: globalModuleMock }
//       ],
//       schemas: [CUSTOM_ELEMENTS_SCHEMA] // Añadir esta línea
//     }).compileComponents();

//     fixture = TestBed.createComponent(ExcessComponent);
//     component = fixture.componentInstance;
//     fixture.detectChanges();
//   });

//   it('should create', () => {
//     expect(component).toBeTruthy();
//   });

//   it('should initialize form with default values', () => {
//     expect(component.form.get('month')).toBeTruthy();
//     expect(component.form.get('year')).toBeTruthy();
//     expect(component.global.getControlValue(component.form, 'month')).toBe(0);
//     expect(component.global.getControlValue(component.form, 'year')).toBe(0);
//   });

//   it('should handle date filtering correctly', () => {
//     const currentDate = moment();
//     const pastDate = moment().subtract(1, 'month');
//     const futureDate = moment().add(1, 'month');

//     expect(component.filter(pastDate)).toBeTrue();
//     expect(component.filter(futureDate)).toBeFalse();
//   });

//   it('should set month and year correctly', fakeAsync(() => {
//     const testDate = moment('2023-06-15');
//     const mockDatepicker = { close: jasmine.createSpy('close') };

//     component.setMonthAndYear(testDate, mockDatepicker as any);
//     tick();

//     expect(component.global.getControlValue(component.form, 'month')).toBe(5); // June is 5 (0-based)
//     expect(component.global.getControlValue(component.form, 'year')).toBe(2023);
//     expect(mockDatepicker.close).toHaveBeenCalled();
//   }));

//   it('should handle consult click with invalid date', fakeAsync(() => {
//     component.form.patchValue({ month: -1, year: null });
//     component.onConsultClick();
//     tick();

//     expect(globalModuleMock.openDialog).toHaveBeenCalledWith('Por favor, selecciona un mes y un año.');
//     expect(component.showTable).toBeFalse();
//   }));

//   it('should handle consult click with valid date', fakeAsync(() => {
//     component.form.patchValue({ month: 5, year: 2023 });
//     component.onConsultClick();
//     tick();

//     expect(globalModuleMock.httpCenter.getExcess).toHaveBeenCalledWith('Jun 2023');
//     expect(component.showTable).toBeTrue();
//     expect(component.dataSource.data.length).toBe(1);
//     expect(component.dataSource.data[0].workCenter).toBe('Test Center');
//   }));

//   it('should handle empty excess data', fakeAsync(() => {
//     globalModuleMock.httpCenter.getExcess.and.returnValue(of([]));
//     component.form.patchValue({ month: 5, year: 2023 });
//     component.onConsultClick();
//     tick();

//     expect(component.noResults).toBeTrue();
//     expect(component.dataSource.data.length).toBe(0);
//   }));

//   it('should hide table when showing datepicker', () => {
//     const mockDatepicker = { open: jasmine.createSpy('open') };
//     component.showTable = true;

//     component.showDatepicker(mockDatepicker as any);

//     expect(component.showTable).toBeFalse();
//     expect(mockDatepicker.open).toHaveBeenCalled();
//   });

//   afterEach(() => {
//     // Cleanup
//   });
// });
