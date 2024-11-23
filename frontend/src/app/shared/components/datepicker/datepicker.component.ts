import { Component, ChangeDetectionStrategy, Input, Output, EventEmitter } from '@angular/core';
import { provideNativeDateAdapter } from '@angular/material/core';
import { DateFilterFn } from '@angular/material/datepicker';

@Component({
  selector: 'app-datepicker',
  templateUrl: './datepicker.component.html',
  styleUrl: './datepicker.component.css',
  providers: [provideNativeDateAdapter()],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DatepickerComponent {
  @Input() filter: DateFilterFn<any> = [][0];
  @Input() label: string = 'Elige una fecha';
  @Output() dateSelected = new EventEmitter<Date>();

  /**
   * Emits the selected date to the parent component.
   * @param event The event emitted by the date picker.
   */
  onDateChange(event: any) {
    const selectedDate = event.value;
    this.dateSelected.emit(selectedDate);
  }
}
