import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigColumn } from '../../../../../shared/components/table/table.component';
import { GlobalModule } from '../../../../global/global.module';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Item } from '../../../../../shared/shared.module';
import { API_URL, EXPORT_ALERT } from '../../../../../config/api.config';

@Component({
  selector: 'app-alert',
  templateUrl: './alert.component.html',
  styleUrl: './alert.component.css'
})
export class AlertComponent implements OnInit {
  form: FormGroup;
  showTable: boolean = false;
  noResults: boolean = false;
  export: FormControl = new FormControl();
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

  constructor(
    public global: GlobalModule,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      workCenter: ''
    });

    if (!this.global.getUserInfo().roles.includes('Admin')) {
      const name = this.global.getUserInfo().company.name;
      const id = this.global.getUserInfo().company.id;
      const workCenter: Item = {
        id: id,
        name: name
      };
      this.global.getControl(this.form, 'workCenter').setValue(workCenter);
    }

    this.form.valueChanges.subscribe(() => {
      this.showTable = false;
      this.dataSource.data = [];
    });
  }

  ngOnInit(): void {
    this.global.Reset();
    this.global.getWorkCenters();
  }

  /**
   * Toggles the visibility of the table and fetches alerts for the selected center.
   * This method is triggered when the user clicks on the alert button.
   */
  onConsultClick() {
    if (!this.showTable) {
      this.noResults = false;
      const id = this.global.getControlValue(this.form, 'workCenter').id;
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
   * Exports alert data based on the selected work center and user information.
   * Constructs the export route using the API URL, company ID, user ID, and selected format.
   * Initiates the export process with the constructed route and specified format.
   */
  exportFunction(): void {
    const userId = this.global.getUserInfo().id;
    const centerId = this.global.getControlValue(this.form, 'workCenter').id;
    const format = this.export.value.name;
    const route = `${API_URL}${EXPORT_ALERT}?companyId=${centerId}&userId=${userId}&format=${format}`;
    this.global.export(route, "Registros_de_consumo", format);
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
