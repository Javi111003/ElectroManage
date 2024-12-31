import { Component, OnInit } from '@angular/core';
import { ConfigColumn } from '../../../../../shared/components/table/table.component';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalModule } from '../../../../global/global.module';
import { DataService } from '../../../../../services/data/data.service';

declare var bootstrap: any;

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.css']
})

export class EquipmentComponent implements OnInit {
  data: any;
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
      title: 'Fecha de instalación',
      field: 'instalationDate'
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

  constructor(
    private fb: FormBuilder,
    public global: GlobalModule,
    private dataService: DataService
  ) {
    this.form = this.fb.group({
      workCenter: '',
      office: ''
    });

    this.form.valueChanges.subscribe(() => { this.showTable = false });

    this.form.get('workCenter')?.valueChanges.subscribe(() => {
      this.getControl('office').reset();
      if (this.global.isOptionValid(this.global.centerStringArray, this.getControlValue('workCenter'))) {
        this.global.findCenterId(this.getControlValue('workCenter'));
        this.global.getOfficesByCenter(this.global.centerSelectedId);
      }
    });
    this.form.get('office')?.valueChanges.subscribe(() => {
      if (this.global.isOptionValid(this.global.officeStringArray, this.getControlValue('office'))) {
        this.global.findOfficeId(this.getControlValue('office'));
        this.getEquipmentsByOffice();
      }
    });
  }

  ngOnInit(): void {
    this.global.Reset();
    this.global.getWorkCenters();
  }

  /**
   * This function is used to get the form control by its name.
   * @param control The name of the form control.
   * @returns The form control with the specified name.
   */
  getControl(control: string): FormControl {
    return this.form.get(control) as FormControl;
  }

  /**
   * This function is used to get the value of a form control by its name.
   * @param control The name of the form control.
   * @returns The value of the form control with the specified name.
   */
  getControlValue(control: string): any {
    return this.form.get(control)?.value;
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
        this.global.openDialog('Por favor, selecciona un Centro de Trabajo y una Oficina válidos.');
      }
    }
  }

  onAddClick(): void {
    const center = this.getControlValue('workCenter');
    const office = this.getControlValue('office');
    this.dataService.setData([null, center, office]);
    const modal = new bootstrap.Modal(document.getElementById('exampleModal') as HTMLElement);
    modal.show();
  }

  delete(): void {
    this.global.openDialog('¿Estás seguro de que deseas continuar?').subscribe(
      result => { if (result) {
        this.global.openDialog('Eliminado');
      }
    });
  }

  edit(item: any): void {
    this.dataService.setData([item, this.getControlValue('workCenter'), this.getControlValue('office')]);
    const modal = new bootstrap.Modal(document.getElementById('exampleModal') as HTMLElement);
    modal.show();
  }
}

