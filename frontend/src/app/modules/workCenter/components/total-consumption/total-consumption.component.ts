import { Component, OnInit } from '@angular/core';
import { ConfigColumn } from '../../../../shared/components/table/table.component';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalModule } from '../../../global/global.module';
import { WorkCenterService } from '../../../../services/workCenter/work-center.service';

@Component({
  selector: 'app-total-consumption',
  templateUrl: './total-consumption.component.html',
  styleUrl: './total-consumption.component.css'
})
export class TotalConsumptionComponent implements OnInit {

  constructor (
    public global: GlobalModule,
    private httpService: WorkCenterService
  ) {}

  receivedDate: Date = [][0];
  isTableActive: boolean = false;
  optionSelected: number = 0;
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
  }

  /**
   * Fetches registers by center ID and updates the data source.
   * Makes an HTTP request to get registers for a specified center ID,
   * formats the register dates, and updates the data source.
   * @param centerID - The ID of the center to fetch registers for.
  */
  getRegistersByCenterId(centerID: number): void {
    this.httpService.getRegister().subscribe(register => {
      for (let index = 0; index < register.registers.length; index++) {
        register.registers[index].registerDate = register.registers[index].registerDate.substring(0, 10);
      }
      this.dataSource.data = register.registers;
      this.consumptions = register.registers.map(item => item.consumption);
      this.costs = register.registers.map(item => item.cost);
      this.footerTable = ['Total', this.getTotalConsumption().toString(), this.getTotalCost().toString()];
    })
  }

  /**
   * This function is used to filter the start date.
hi   * It checks if the selected date is before the current date.
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
    if (!this.receivedDate)
      return false;

    let dateSelected = this.receivedDate;
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
   * Handles the selection of an option.
   * Updates the optionSelected property with the selected option.
   * @param option The selected option.
   */
  handleOptionSelected(option: any) {
    this.optionSelected = option;
  }

  /**
   * Handles the selection of a date.
   * Updates the receivedDate property with the selected date.
   * @param date The selected date.
   */
  handleDateSelected(date: Date) {
    this.receivedDate = date;
  }

  /**
   * Handles the click event on the table toggle button.
   * Toggles the visibility of the table based on the current state.
   */
  onClick() {
    this.getRegistersByCenterId(0);
    this.isTableActive = !this.isTableActive;
  }

  /** * Calculates the total cost.
  * * This function uses the reduce method to sum up all the values
  * in the `costs` array and returns the total.
  * * @returns {number} - The total cost.
  */
  getTotalCost(): number {
    return this.costs.reduce((acc, value) => acc + value, 0);
  }

  /** * Calculates the total consumption.
  * * This function uses the reduce method to sum up all the values
  * in the `consumptions` array and returns the total.
  * * @returns {number} - The total consumption.
  */
  getTotalConsumption(): number {
    return this.consumptions.reduce((acc, value) => acc + value, 0);
  }
}
