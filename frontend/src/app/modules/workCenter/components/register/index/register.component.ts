import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfigColumn } from '../../../../../shared/components/table/table.component';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalModule } from '../../../../global/global.module'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {

  constructor (
    public global: GlobalModule,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      startDate: [null],
      endDate: [null],
      workCenter: ''
    });

    this.form.valueChanges.subscribe(() => { this.showTable = false });
  }

  form: FormGroup;
  showTable: boolean = false;
  dataSource: MatTableDataSource<any> = new MatTableDataSource([0]);
  consumptions: number[] = [];
  costs: number[] = [];
  footerTable: any[] = [];
  displayedColumns: ConfigColumn[] = [
    {
      title: 'Día',
      field: 'registerDate'
    },
    {
      title: 'Consumo (Kw/h)',
      field: 'consumption'
    },
    {
      title: 'Costo ($)',
      field: 'cost'
    }
  ];

  ngOnInit(): void {
    this.global.Reset();
    this.global.getWorkCenters();
    this.form.get('startDate')?.valueChanges.subscribe(() => { this.getControl('endDate').reset(); });
  }

  getControl(control: string): FormControl {
    return this.form.get(control) as FormControl;
  }

  getControlValue(control: string): any {
    return this.form.get(control)?.value;
  }

  /**
   * Fetches registers by center ID and updates the data source.
   * Makes an HTTP request to get registers for a specified center ID,
   * formats the register dates, and updates the data source.
   * @param centerID - The ID of the center to fetch registers for.
   */
  getRegistersByCenterId(centerID: number): void {
    this.global.httpCenter.getRegister().subscribe(register => {
      const registers = register.registers

      for (let index = 0; index < register.registers.length; index++) {
        registers[index].registerDate = registers[index].registerDate.substring(0, 10);
      }

      this.dataSource.data = register.registers;
      this.consumptions = this.dataSource.data.map(item => item.consumption);
      this.costs = this.dataSource.data.map(item => item.cost);
      this.footerTable = [
        'Total',
        this.getTotalConsumption().toFixed(2).toString(),
        this.getTotalCost().toFixed(2).toString()
      ];
    })
  }

  /**
   * This function is used to filter the start date.
   * It checks if the selected date is before the current date.
   * @param d The selected date.
   * @returns A boolean value indicating if the date is valid.
   */
  filterStartDate = (d: Date | null): boolean => {
    const today = new Date();
    const Tday = today.getDate();
    const Tmonth = today.getMonth();
    const Tyear = today.getFullYear();

    const day = d?.getDate();
    const month = d?.getMonth();
    const year = d?.getFullYear();

    if (year !== undefined && month !== undefined && day !== undefined &&
      (year < Tyear || (year === Tyear && (month < Tmonth) || (month === Tmonth && day < Tday))))
      return true;

    return false
  };

  /**
   * This function is used to filter the end date.
   * It checks if the selected date is after the received date and before the current date.
   * @param d The selected date.
   * @returns A boolean value indicating if the date is valid.
   */
  filterEndDate = (d: Date | null): boolean => {
    if (!this.getControlValue('startDate') || !d)
      return false;

    let dateSelected = this.getControlValue('startDate');
    const DSday = dateSelected.getDate();
    const DSmonth = dateSelected.getMonth();
    const DSyear = dateSelected.getFullYear();

    const today = new Date();
    const Tday = today.getDate();
    const Tmonth = today.getMonth();
    const Tyear = today.getFullYear();

    const day = d?.getDate();
    const month = d?.getMonth();
    const year = d?.getFullYear();

    if (year !== undefined && month !== undefined && day !== undefined &&
      (year > DSyear || (year === DSyear && (month > DSmonth) || (month === DSmonth && day >= DSday))) &&
      (year < Tyear || (year === Tyear && (month < Tmonth) || (month === Tmonth && day < Tday))))
      return true;

    return false
  };

  /**
   * Handles the click event on the table toggle button.
   * Toggles the visibility of the table based on the current state.
   */
  onClick() {
    if (!this.showTable) {
      if (this.global.isOptionValid(this.global.centerStringArray, this.getControlValue('workCenter')) &&
      this.getControlValue('startDate') && this.getControlValue('endDate')) {
        this.getRegistersByCenterId(0);
        this.showTable = true;
      } else {
        this.global.openDialog('Por favor, selecciona un Centro de Trabajo, fecha de inicio y de fin válidos.');
      }
    }
  }

  /**
  * Calculates the total cost.
  * This function uses the reduce method to sum up all the values
  * in the `costs` array and returns the total.
  * @returns The total cost.
  */
  getTotalCost(): number {
    return this.costs.reduce((acc, value) => acc + value, 0);
  }

  /**
  * Calculates the total consumption.
  * This function uses the reduce method to sum up all the values
  * in the `consumptions` array and returns the total.
  * @returns The total consumption.
  */
  getTotalConsumption(): number {
    return this.consumptions.reduce((acc, value) => acc + value, 0);
  }
}
