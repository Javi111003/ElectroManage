import { Component, OnInit } from '@angular/core';
import { ConfigColumn } from '../../../../shared/components/table/table.component';
import { WorkCenterService } from '../../../../services/workCenter/work-center.service';
import { MatTableDataSource } from '@angular/material/table';
import { WorkCenter } from '../../../../models/workCenter.interface';

@Component({
  selector: 'app-total-consumption',
  templateUrl: './total-consumption.component.html',
  styleUrl: './total-consumption.component.css'
})
export class TotalConsumptionComponent implements OnInit {

  constructor (
    private httpService: WorkCenterService
  ) {}

  receivedDate: Date = [][0];
  isTableActive: boolean = false;
  options: string[] = [];
  workCenters: WorkCenter[] = [];
  optionSelected: number = 0;
  dataSource: MatTableDataSource<any> = new MatTableDataSource([0]);
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
    this.getWorkCenters();
  }

  /**
   * This function retrieves the list of work centers.
   * It updates the options array with the list of available work centers.
   */
  getWorkCenters(): void {
    this.httpService.getWorkCenterList().subscribe(workcenters => {
      this.options = workcenters.map(item => item.name);
      this.workCenters = workcenters;
    })
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
    console.log(this.receivedDate);
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
}
