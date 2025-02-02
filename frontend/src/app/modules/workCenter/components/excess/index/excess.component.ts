import { ChangeDetectionStrategy, Component, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import { MatDatepicker } from '@angular/material/datepicker';
import _moment from 'moment';
import {default as _rollupMoment, Moment} from 'moment';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigColumn } from '../../../../../shared/components/table/table.component';
import { GlobalModule } from '../../../../global/global.module';
import { API_URL, EXPORT_EXCESS, MY_FORMATS } from '../../../../../config/api.config';

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
  form: FormGroup;
  dateInitialize: Moment = [][0];
  readonly date = new FormControl(this.dateInitialize);
  showTable: boolean = false;
  noResults: boolean = false;
  export: FormControl = new FormControl();
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
      field:'limit'
    },
    {
      title:'Exceso (Kw/h)',
      field:'exceeded'
    }
  ];
  monthMapper: Map<number, string> = new Map<number, string>([
    [0, 'Jan'], [1, 'Feb'], [2, 'Mar'], [3, 'Apr'],
    [4, 'May'], [5, 'Jun'], [6, 'Jul'], [7, 'Aug'],
    [8, 'Sep'], [9, 'Oct'], [10, 'Nov'], [11, 'Dec']
  ])

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

  /**
   * Sets the selected month and year to the date control and updates the view.
   * @param normalizedMonthAndYear The selected month and year.
   * @param datepicker The datepicker instance to close.
   */
  setMonthAndYear(normalizedMonthAndYear: Moment, datepicker: MatDatepicker<Moment>): void {
    const ctrlValue = this.date.value ?? moment();
    ctrlValue.month(normalizedMonthAndYear.month());
    ctrlValue.year(normalizedMonthAndYear.year());
    this.global.getControl(this.form, 'year').setValue(ctrlValue.year());
    this.global.getControl(this.form, 'month').setValue(ctrlValue.month());
    console.log(this.form);
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
  onConsultClick(): void {
    if (!this.showTable) {
      this.noResults = false;
      if (this.global.getControlValue(this.form, 'year') && this.global.getControlValue(this.form, 'month') >= 0) {
        this.getExcess();
        this.showTable = true;
      }
      else
        this.global.openDialog('Por favor, selecciona un mes y un año.');
    }
  }

  /**
   * Exports the excess consumption data based on the selected month, year, and format.
   * Constructs the export URL using the user ID, selected month, year, and format.
   * Initiates the export process by calling the global export function.
   */
  exportFunction(): void {
    const userId = this.global.getUserInfo().id;
    const month = this.monthMapper.get(this.global.getControlValue(this.form, 'month'));
    const year = this.global.getControlValue(this.form, 'year');
    const format = this.export.value.name;
    const route = `${API_URL}${EXPORT_EXCESS}?userId=${userId}&date=${month}%20${year}&format=${format}`;
    this.global.export(route, "Exceso_de_Cosumo", format);
  }

  /**
   * Opens the datepicker and hides the table.
   * @param datepicker The datepicker instance to open.
   */
  showDatepicker(datepicker: MatDatepicker<Moment>) {
    datepicker.open();
    this.showTable = false;
  }

  getExcess(): void {
    const month = this.monthMapper.get(this.global.getControlValue(this.form, 'month'));
    const year = this.global.getControlValue(this.form, 'year');
    this.global.httpCenter.getExcess(`${month} ${year}`).subscribe(data => {
      this.dataSource.data = data.map(item => ({
        workCenter: item.company.name,
        limit: item.limit,
        consumption: item.consumption,
        exceeded: item.exceeded
      }));

      this.noResults = this.dataSource.data.length == 0;
    });
  }
}
