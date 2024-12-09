import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfigColumn } from '../../../../../shared/components/table/table.component';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalModule } from '../../../../global/global.module';


@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.css']
})

export class EquipmentComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    public global: GlobalModule
  ) {
    this.form = this.fb.group({
      workCenter: '',
      office: ''
    });

    this.form.valueChanges.subscribe(() => { this.showTable = false });
  }

  form: FormGroup;
  showTable = false;

  officeSelectedId: number | any = 0;

  equipments: string[] = [];

  // Example data for the table
  dataSource: MatTableDataSource<any> = new MatTableDataSource([0]);

  // Table Columns
  displayedColumns: ConfigColumn[] = [
    {
      title: 'No. Inventario',
      field: 'id'
    },
    {
      title: 'Nombre',
      field: 'name'
    },
    {
      title: 'Frecuencia de uso',
      field: 'useFrequency'
    },
    {
      title: 'Estado de mantenimiento',
      field: 'maintenanceStatus'
    },
    {
      title: 'Marca',
      field: 'brand'
    },
    {
      title: 'Modelo',
      field: 'model'
    },
    {
      title: 'Eficiencia',
      field: 'efficiency'
    },
    {
      title: 'Tipo',
      field: 'equipmentType'
    }
  ];

  ngOnInit(): void {
    this.global.Reset();
    this.global.getWorkCenters();
    this.form.get('workCenter')?.valueChanges.subscribe(() => {
      this.getControl('office').reset();
      if (this.global.isOptionValid(this.global.centerStringArray, this.getControlValue('workCenter'))) {
        this.global.findCenterId(this.getControlValue('workCenter'));
        this.global.getOfficesByCenter(this.global.centerSelectedId);
      }
    });
    this.form.get('office')?.valueChanges.subscribe(() => {
      if (this.global.isOptionValid(this.global.officeStringArray, this.getControlValue('office'))) {
        this.findOfficeId();
        this.getEquipmentsByOffice();
      }
    });
  }

  getControl(control: string): FormControl {
    return this.form.get(control) as FormControl;
  }

  getControlValue(control: string): any {
    return this.form.get(control)?.value;
  }

  /**
   * Finds the ID of the selected office based on its name.
   * @param officeSelected The name of the selected office.
   */
  findOfficeId(): void {
    const officeSelected = this.getControlValue('office');
    this.officeSelectedId = this.global.officeObjectArray.find(item => item.name === officeSelected)?.id;
  }

  /**
   * This function retrieves the list of equipment based on the selected office.
   * It updates the dataSource for the MatTable with the list of equipment.
   */
  getEquipmentsByOffice(): void {
    this.global.httpOffice.getEquipmentList(this.global.centerSelectedId, this.officeSelectedId)
      .subscribe(equipments => {
        this.dataSource.data = equipments.map(item => ({
          id: `${item.companyId}${item.officeId}${item.id}`,
          name: item.name,
          useFrequency: item.useFrequency,
          maintenanceStatus: item.maintenanceStatus,
          brand: item.brand,
          model: item.model,
          efficiency: item.efficiency,
          equipmentType: item.equipmentType
        }));
      });
  }

  /**
   * Handles the "Consultar" button click event.
   * Checks if both center and office are selected before showing the table.
   * If not, displays an alert message.
   */
  onConsultClick(): void {
    if (!this.showTable) {
      if (this.global.isOptionValid(this.global.centerStringArray, this.getControlValue('workCenter')) &&
          this.global.isOptionValid(this.global.officeStringArray, this.getControlValue('office'))) {
        this.showTable = true;
      } else {
        this.showTable = false;
        this.global.openDialog('Por favor, selecciona un Centro de Trabajo y una Oficina.');
      }
    }
  }
}

