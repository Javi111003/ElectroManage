import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDatepicker } from '@angular/material/datepicker';
import _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigColumn } from '../../../../../shared/components/table/table.component';
import { GlobalModule } from '../../../../global/global.module';
import { MY_FORMATS } from '../../../../../config/api.config';

const moment = _rollupMoment || _moment;

@Component({
  selector: 'app-excess',
  templateUrl: './excess.component.html',
  styleUrl: './excess.component.css',
  providers: [
    provideMomentDateAdapter(MY_FORMATS),
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExcessComponent {
  constructor(
    public global: GlobalModule,
    private fb: FormBuilder
  ) {
    this.form = fb.group({
      month: 0,
      year: 0
    });

    this.form.valueChanges.subscribe(() => {
      this.showTable = false;
      this.dataSource.data = [];
    });
  }

  form: FormGroup;
  dateInitialize: Moment = [][0];
  readonly date = new FormControl(this.dateInitialize);
  showTable: boolean = false;
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: ConfigColumn[] = [
    {
      title:'Centro de Trabajo',
      field:'workCenter'
    },
    {
      title:'Consumo (kw/h)',
      field:'consumption'
    },
    {
      title:'Límite Mensual (Kw/h)',
      field:'monthlyLimit'
    },
    {
      title:'Exceso (Kw/h)',
      field:'excess'
    }
  ];

  /**
   * Retrieves a FormControl from the form by its control name.
   * @param control The name of the control to retrieve.
   * @returns The FormControl associated with the given control name.
   */
  getControl(control: string): FormControl {
    return this.form.get(control) as FormControl;
  }

  /**
   * Retrieves the value of a FormControl from the form by its control name.
   * @param control The name of the control to retrieve the value from.
   * @returns The value of the FormControl associated with the given control name.
   */
  getControlValue(control: string): any {
    return this.form.get(control)?.value;
  }

  /**
   * Sets the selected month and year to the date control and updates the view.
   * @param normalizedMonthAndYear The selected month and year.
   * @param datepicker The datepicker instance to close.
   */
  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>): void {
    const ctrlValue = this.date.value ?? moment();
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.getControl('year').setValue(ctrlValue.year());
    this.getControl('month').setValue(ctrlValue.month());
    this.date.setValue(ctrlValue);
    datepicker.close();
  }

  /**
   * Filters the dates to allow only months and years before the current month and year.
   * @param d The date to be checked.
   * @returns True if the date is before the current month and year, otherwise false.
   */
  filter(d: Moment | null): boolean {
    const currentYear = moment().year();
    const currentMonth = moment().month();
    return d ? d.year() < currentYear || (d.year() === currentYear && d.month() < currentMonth) : false;
  }

  /**
   * Displays the table if both the year and month are selected.
   */
  onClick(): void {
    if (!this.showTable) {
      if (this.getControlValue('year') && this.getControlValue('month'))
        this.showTable = true;
      else
        this.global.openDialog('Por favor, selecciona un mes y un año.');
    }
  }

  /**
   * Opens the datepicker and hides the table.
   * @param datepicker The datepicker instance to open.
   */
  showDatepicker(datepicker: MatDatepicker<Moment>) {
    datepicker.open();
    this.showTable = false;
  }
}
