import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormControl } from '@angular/forms';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDatepicker } from '@angular/material/datepicker';
import _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigColumn } from '../../../../shared/components/table/table.component';
import { GlobalModule } from '../../../global/global.module';

const moment = _rollupMoment || _moment;

export const MY_FORMATS = {
  parse: {
    dateInput: 'MM/YYYY',
  },
  display: {
    dateInput: 'MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};

@Component({
  selector: 'app-excess',
  templateUrl: './excess.component.html',
  styleUrl: './excess.component.css',
  providers: [
    // Moment can be provided globally to your app by adding `provideMomentDateAdapter`
    // to your app config. We provide it at the component level here, due to limitations
    // of our example generation script.
    provideMomentDateAdapter(MY_FORMATS),
  ],
  encapsulation: ViewEncapsulation.None,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExcessComponent {

  constructor(
    public global: GlobalModule
  ) {}

  dateInitialize: Moment = [][0];
  readonly date = new FormControl(this.dateInitialize);
  yearSelected: number = 0;
  monthSelected: number = 0;
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
   * Sets the selected month and year to the date control and updates the view.
   * @param normalizedMonthAndYear The selected month and year.
   * @param datepicker The datepicker instance to close.
   */
  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>): void {
    const ctrlValue = this.date.value ?? moment();
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.yearSelected = ctrlValue.year();
    this.monthSelected = ctrlValue.month();
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
    if (this.yearSelected && this.monthSelected)
      this.showTable = true;
    else
      this.global.openDialog('Por favor, selecciona una fecha válida.');
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
