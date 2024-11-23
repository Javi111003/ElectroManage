import { Component } from '@angular/core';
import { ConfigColumn } from '../../../../shared/components/table/table.component';

import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-total-consumption',
  templateUrl: './total-consumption.component.html',
  styleUrl: './total-consumption.component.css'
})
export class TotalConsumptionComponent {
  dataSource: MatTableDataSource<any> = new MatTableDataSource([
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
  ]);

  displayedColumns: ConfigColumn[] = [
    {
      title: 'No.',
      field: 'position'
    },
    {
      title: 'Name',
      field: 'name'
    }
  ];

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

  receivedDate: Date = [][0];

  filterEndDate = (d: Date | null): boolean => {
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

  isTableActive: boolean = false;

  options: string[] = [
    'Centro 1',
    'Centro 2',
    'Centro 3',
    'Cento 4',
    'Cento 5',
    'Cento 6',
    'Casa'
  ];

  optionSelected: string = '';

  handleOptionSelected(option: string) {
    this.optionSelected = option;
  }

  handleDateSelected(date: Date) {
    this.receivedDate = date;
    console.log('Fecha seleccionada:', this.receivedDate);
  }

  onClick() {
    this.isTableActive = !this.isTableActive;
    console.log(this.isTableActive);
  }
}
