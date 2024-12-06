import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigColumn } from '../../../../shared/components/table/table.component';
import { GlobalModule } from '../../../global/global.module';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent implements OnInit {
  constructor(
    public global: GlobalModule
  ) {}

  showTable: boolean = false;
  centerSelected: string = '';
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: ConfigColumn[] = [
    {
      title:'Mes/Año',
      field:'date'
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


  ngOnInit(): void {
    this.global.Reset();
    this.global.getWorkCenters();
  }

  /**
   * Toggles the visibility of the table and fetches alerts for the selected center.
   * This method is triggered when the user clicks on the alert button.
   */
  onClick() {
    if (!this.showTable) {
      if (this.global.isOptionValid(this.global.centerStringArray, this.centerSelected)) {
        this.global.findCenterId(this.centerSelected);
        this.getAlerts(this.global.centerSelectedId);
        this.showTable = true;
      }
      else {
        this.global.openDialog('Por favor, selecciona un Centro de Trabajo.');
      }
    }
  }

  /**
   * Fetches alerts for the specified center ID and updates the data source for the table.
   * @param centerID The ID of the center for which to fetch alerts.
   */
  getAlerts(centerID: number): void {
    this.global.httpCenter.getAlerts(centerID).subscribe(alert => {
      this.dataSource.data = alert.warnings.map(item => ({
        date: `${item.month}/${item.year}`,
        consumption: item.consumption.toFixed(2),
        monthlyLimit: item.establishedLimit.toFixed(2),
        excess: (item.consumption - item.establishedLimit).toFixed(2)
      }));
    });
  }

  /**
   * This function is used to handle the selection of an option.
   * @param option The selected option.
   */
  handleOptionSelected(option: string) {
    this.centerSelected = option;
  }

  /**
   * Handles the change event of the first select control.
   * @param event The change event of the first select control.
   */
  onCenterInputModified(value: string): void {
    this.centerSelected = value;
    this.showTable = false;

    if (this.global.isOptionValid(this.global.centerStringArray, this.centerSelected)) {
      this.global.findCenterId(this.centerSelected);
    }
  }
}
