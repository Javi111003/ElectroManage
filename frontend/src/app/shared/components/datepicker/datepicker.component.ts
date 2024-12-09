import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter, LOCALE_ID, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MAT_DATE_LOCALE, provideNativeDateAdapter } from '@angular/material/core';
import { DateFilterFn } from '@angular/material/datepicker';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrl: './datepicker.component.css',
  providers: [
    provideNativeDateAdapter(),
    { provide: MAT_DATE_LOCALE, useValue: 'es-ES' },
    { provide: LOCALE_ID, useValue: 'es' }
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  encapsulation: ViewEncapsulation.None
})
export class DatepickerComponent {
  @Input() filter: DateFilterFn<any> = [][0];
  @Input() control: FormControl = new FormControl();
  @Input() label: string = 'Elige una fecha';
}
