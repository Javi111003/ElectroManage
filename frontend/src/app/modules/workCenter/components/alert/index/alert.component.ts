import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigColumn } from '../../../../../shared/components/table/table.component';
import { GlobalModule } from '../../../../global/global.module';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Item } from '../../../../../shared/shared.module';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent implements OnInit {
  constructor(
    public global: GlobalModule,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      workCenter: ''
    });

    if (!this.global.getUserInfo().roles.includes('Admin')) {
      const name = this.global.getUserInfo().info.company.name;
      const id = this.global.getUserInfo().info.company.id;
      const workCenter: Item = {
        id: id,
        name: name
      };
      this.getControl('workCenter').setValue(workCenter);
    }

    this.form.valueChanges.subscribe(() => {
      this.showTable = false;
      this.dataSource.data = [];
    });
  }

  form: FormGroup;
  showTable: boolean = false;
  noResults: boolean = false;
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
   * Returns the form control with the specified name.
   * @param control The name of the form control to retrieve.
   * @returns The form control with the specified name.
   */
  getControl(control: string): FormControl {
    return this.form.get(control) as FormControl;
  }

  /**
   * Returns the value of the form control with the specified name.
   * @param control The name of the form control to retrieve the value from.
   * @returns The value of the form control with the specified name.
   */
  getControlValue(control: string): any {
    return this.form.get(control)?.value;
  }

  /**
   * Toggles the visibility of the table and fetches alerts for the selected center.
   * This method is triggered when the user clicks on the alert button.
   */
  onConsultClick() {
    if (!this.showTable) {
      this.noResults = false;
      const id = this.getControlValue('workCenter').id;
      if (id) {
        this.getAlerts(id);
        this.showTable = true;
      }
      else {
        this.global.openDialog('Por favor, selecciona un Centro de Trabajo válido.');
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

      this.noResults = this.dataSource.data.length == 0;
    });
  }
}
