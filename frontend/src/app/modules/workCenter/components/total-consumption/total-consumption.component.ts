import { Component, OnInit } from '@angular/core';
import { ConfigColumn } from '../../../../shared/components/table/table.component';

import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-total-consumption',
  templateUrl: './total-consumption.component.html',
  styleUrl: './total-consumption.component.css'
})
export class TotalConsumptionComponent implements OnInit {

  receivedDate: Date = [][0];
  isTableActive: boolean = false;
  options: string[] = [];
  optionSelected: string = '';
  dataSource: MatTableDataSource<any> = new MatTableDataSource([0]);
  displayedColumns: ConfigColumn[] = [
    {
      title: 'Día',
      field: 'day'
    },
    {
      title: 'Consumo',
      field: 'consumption'
    },
    {
      title: 'Costo',
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
    this.options = [
      'Centro 1',
      'Centro 2',
      'Centro 3',
      'Cento 4',
      'Cento 5',
      'Cento 6',
      'Casa'
    ];
  }

  /**
   * This function generates the table data source.
   * It updates the MatTableDataSource with data from backend.
   */
  generateTable(): void {
    this.dataSource.data = [
      {position: 1, name: 'Hydrogen'},
      {position: 2, name: 'Helium'},
      {position: 3, name: 'Lithium'},
      {position: 4, name: 'Beryllium'},
      {position: 5, name: 'Boron'},
      {position: 6, name: 'Carbon'},
      {position: 7, name: 'Nitrogen'},
      {position: 8, name: 'Oxygen'},
      {position: 9, name: 'Fluorine'},
      {position: 10, name: 'Neon'},
    ];
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
  handleOptionSelected(option: string) {
    this.optionSelected = option;
  }

  /**
   * Handles the selection of a date.
   * Updates the receivedDate property with the selected date.
   * @param date The selected date.
   */
  handleDateSelected(date: Date) {
    this.receivedDate = date;
    console.log(this.receivedDate);
  }

  /**
   * Handles the click event on the table toggle button.
   * Toggles the visibility of the table based on the current state.
   */
  onClick() {
    this.generateTable();
    this.isTableActive = !this.isTableActive;
  }
}
