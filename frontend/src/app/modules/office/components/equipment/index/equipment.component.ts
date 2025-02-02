import { Equipment } from './../../../../../models/equipment.interface';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfigColumn } from '../../../../../shared/components/table/table.component';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalModule } from '../../../../global/global.module';
import { DataService } from '../../../../../services/data/data.service';
import { Subscription } from 'rxjs';
import { Item } from '../../../../../shared/shared.module';
import { SnackbarService } from '../../../../../services/snackbar/snackbar.service';
import { API_URL, EXPORT_EQUIPMENT } from '../../../../../config/api.config';

declare var bootstrap: any;

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.css']
})

export class EquipmentComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  data: any;
  form: FormGroup;
  showTable: boolean = false;
  noResults: boolean = false;
  export: FormControl = new FormControl();
  equipmentObjects: Equipment[] = [];
  equipments: string[] = [];
  useFrequency: Map<string, string> = new Map<string, string>([
    ['High', 'Alta'],
    ['Medium', 'Media'],
    ['Low', 'Baja']
  ]);
  maintenanceStatus: Map<string, string> = new Map<string, string>([
    ['Good', 'Bueno'],
    ['Regular', 'Regular'],
    ['Bad', 'Malo']
  ]);
  criticalEnergySystem: Map<boolean, string> = new Map<boolean, string>([
    [true, 'Sí'],
    [false, 'No']
  ]);
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: ConfigColumn[] = [
    {
      title: 'Fecha de instalación',
      field: 'instalationDate'
    },
    {
      title: 'Modelo',
      field: 'model'
    },
    {
      title: 'Tipo',
      field: 'type'
    },
    {
      title: 'Marca',
      field: 'brand'
    },
    {
      title: 'Capacidad(Kw)',
      field: 'capacity'
    },
    {
      title: 'Consumo Promedio(Kw/h)',
      field: 'averageConsumption'
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
      title: 'Años de vida',
      field: 'lifeSpanYears'
    },
    {
      title: 'Eficiencia',
      field: 'efficiency'
    },
    {
      title: 'Sistema de Energía Crítica',
      field: 'criticalEnergySystem'
    }
  ];

  constructor(
    private fb: FormBuilder,
    public global: GlobalModule,
    private dataService: DataService,
    private snackbar: SnackbarService
  ) {
    this.form = this.fb.group({
      workCenter: '',
      office: ''
    });

    this.form.valueChanges.subscribe(() => {
      this.showTable = false;
      this.dataSource.data = [];
    });

    if (!this.global.getUserInfo().roles.includes('Admin')) {
      const name = this.global.getUserInfo().company.name;
      const id = this.global.getUserInfo().company.id;
      const workCenter: Item = {
        id: id,
        name: name
      };
      this.global.getControl(this.form, 'workCenter').setValue(workCenter);
      this.global.getOfficesByCenter(id);
    }

    this.form.get('workCenter')?.valueChanges.subscribe(() => {
      this.global.getControl(this.form, 'office').reset();
      this.global.offices = [];
      if (this.global.getControlValue(this.form, 'workCenter')) {
        const id = this.global.getControlValue(this.form, 'workCenter').id;
        if (id) {
          this.global.getOfficesByCenter(id);
        }
      }
    });

    this.form.get('office')?.valueChanges.subscribe(() => {
      if (this.global.getControlValue(this.form, 'office')) {
        const id = this.global.getControlValue(this.form, 'office').id;
        if (id) {
          this.getEquipmentsByOffice();
        }
      }
    });
  }

  ngOnInit(): void {
    this.global.Reset();
    this.global.getWorkCenters();

    const sub = this.dataService.dataUpdated$.subscribe(() => {
      const office = this.global.getControlValue(this.form, 'office');
      if (office && office.id) {
        this.getEquipmentsByOffice();
      }
    });
    this.subscriptions.add(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * This function retrieves the list of equipment based on the selected office.
   * It updates the dataSource for the MatTable with the list of equipment.
   */
  getEquipmentsByOffice(): void {
    const office = this.global.getControlValue(this.form, 'office');
    if (office && office.id) {
      this.global.httpOffice.getEquipmentList(office.id).subscribe(equipments => {
        this.equipmentObjects = equipments;
        this.reloadTableData(equipments);
      });
    }
  }

  /**
   * Handles the "Consultar" button click event.
   * Checks if both center and office are selected before showing the table.
   * If not, displays an alert message.
   */
  onConsultClick(): void {
    if (!this.showTable) {
      const center = this.global.getControlValue(this.form, 'workCenter');
      const office = this.global.getControlValue(this.form, 'office');
      if (center && office && center.id && office.id) {
        this.showTable = true;
      } else {
        this.showTable = false;
        this.global.openDialog('Por favor, selecciona un Centro de Trabajo y una Oficina válidos.');
      }
    }
  }

  /**
   * Exports equipment data based on the selected office and format.
   *
   * This function retrieves the user ID and office ID from the global state,
   * constructs an export URL with the specified format, and triggers the export process.
   */
  exportFunction(): void {
    const userId = this.global.getUserInfo().id;
    const officeId = this.global.getControlValue(this.form, 'office').id;
    const format = this.export.value.name;
    const route = `${API_URL}${EXPORT_EQUIPMENT}?userId=${userId}&officeId=${officeId}&format=${format}`;
    this.global.export(route, "Exceso_de_Cosumo", format);
  }

  /**
   * This function is used to handle the "Add" button click event.
   * It retrieves the values of 'workCenter' and 'office' from the form controls,
   * sets them along with a null value and a boolean indicating it's a new entry,
   * and then opens the modal for adding a new equipment.
   */
  onAddClick(): void {
    const center = this.global.getControlValue(this.form, 'workCenter');
    const office = this.global.getControlValue(this.form, 'office');
    this.dataService.setData([null, center, office, true]);
    const modal = new bootstrap.Modal(document.getElementById('exampleModal') as HTMLElement);
    modal.show();
  }

  /**
   * This function is used to handle the "Delete" button click event.
   * It prompts the user for confirmation before deleting the selected equipment.
   * If the user confirms, it deletes the equipment instance and specification from the server.
   * If the user cancels, it does nothing.
   * @param item The equipment instance to be deleted.
   */
  delete(item: any): void {
    this.global.openDialog('¿Estás seguro de que deseas continuar?', true).subscribe(
      result => { if (result) {
        this.global.httpOffice.deleteEquipmentInstance(item.id).subscribe({
          next: (response) => {
            console.log('Deleted successfully:', response);
            this.snackbar.openSnackBar('Eliminado exitosamente...');
            this.dataService.notifyDataUpdated();
          },
          error: (error) => {
            console.log(error);
            this.snackbar.openSnackBar('Error al eliminar, intente de nuevo...');
          }
        });
        this.global.httpOffice.deleteEquipmentSpecification(item.specifId).subscribe({
          next: (response) => {
            console.log('Deleted successfully:', response);;
          },
          error: (error) => {
            this.global.openDialog(error.error.errors[0].reason);
          }
        });
      }
    });
  }

  /**
   * This function is used to handle the "Edit" button click event.
   * It retrieves the values of 'workCenter' and 'office' from the form controls,
   * sets them along with the selected equipment item and a boolean indicating it's an edit operation,
   * and then opens the modal for editing an existing equipment.
   * @param item The equipment instance to be edited.
   */
  edit(item: any): void {
    this.dataService.setData([
      item, this.global.getControlValue(this.form, 'workCenter'),
      this.global.getControlValue(this.form, 'office'), false
    ]);
    const modalElement = document.getElementById('exampleModal') as HTMLElement;
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }

  /**
   * Reloads the table data with the provided list of equipment.
   * This function updates the data source of the table with the new list of equipment,
   * transforming each equipment item into a format suitable for display in the table.
   * @param equipments The list of equipment to be used to reload the table data.
   */
  reloadTableData(equipments: Equipment[]): void {
    this.dataSource.data = equipments.map(item => ({
      id: item.id,
      specifId: item.equipmentSpecification.id,
      instalationDate: item.instalationDate.substring(0, 10),
      model: item.equipmentSpecification.model,
      type: item.equipmentSpecification.equipmentType.name,
      typeId: item.equipmentSpecification.equipmentType.id,
      brand: item.equipmentSpecification.equipmentBrand.name,
      brandId: item.equipmentSpecification.equipmentBrand.id,
      capacity: item.equipmentSpecification.capacity,
      averageConsumption: item.equipmentSpecification.averageConsumption,
      useFrequency: this.useFrequency.get(item.useFrequency),
      maintenanceStatus: this.maintenanceStatus.get(item.maintenanceStatus),
      lifeSpanYears: item.equipmentSpecification.lifeSpanYears,
      efficiency: item.equipmentSpecification.efficiency,
      criticalEnergySystem: this.criticalEnergySystem.get(
        item.equipmentSpecification.criticalEnergySystem
      )
    }));
    this.noResults = this.dataSource.data.length == 0;
  }
}

