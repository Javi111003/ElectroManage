import { Equipment } from './../../../../../models/equipment.interface';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfigColumn } from '../../../../../shared/components/table/table.component';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalModule } from '../../../../global/global.module';
import { DataService } from '../../../../../services/data/data.service';
import { Subscription } from 'rxjs';
import { Item } from '../../../../../shared/shared.module';

declare var bootstrap: any;

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.css']
})

export class EquipmentComponent implements OnInit, OnDestroy {
  constructor(
    private fb: FormBuilder,
    public global: GlobalModule,
    private dataService: DataService
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
      const name = this.global.getUserInfo().info.company.name;
      const id = this.global.getUserInfo().info.company.id;
      const workCenter: Item = {
        id: id,
        name: name
      };
      this.getControl('workCenter').setValue(workCenter);
      this.global.getOfficesByCenter(id);
    }

    this.form.get('workCenter')?.valueChanges.subscribe(() => {
      this.getControl('office').reset();
      this.global.offices = [];
      if (this.getControlValue('workCenter')) {
        const id = this.getControlValue('workCenter').id;
        if (id) {
          this.global.getOfficesByCenter(id);
        }
      }
    });

    this.form.get('office')?.valueChanges.subscribe(() => {
      if (this.getControlValue('office')) {
        const id = this.getControlValue('office').id;
        if (id) {
          this.getEquipmentsByOffice();
        }
      }
    });
  }

  private subscriptions: Subscription = new Subscription();
  data: any;
  form: FormGroup;
  showTable = false;
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

  ngOnInit(): void {
    this.global.Reset();
    this.global.getWorkCenters();

    const sub = this.dataService.dataUpdated$.subscribe(() => {
      const office = this.getControlValue('office');
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
    const office = this.getControlValue('office');
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
      const center = this.getControlValue('workCenter');
      const office = this.getControlValue('office');
      if (center && office && center.id && office.id) {
        this.showTable = true;
      } else {
        this.showTable = false;
        this.global.openDialog('Por favor, selecciona un Centro de Trabajo y una Oficina válidos.');
      }
    }
  }

  /**
   * This function is used to handle the "Add" button click event.
   * It retrieves the values of 'workCenter' and 'office' from the form controls,
   * sets them along with a null value and a boolean indicating it's a new entry,
   * and then opens the modal for adding a new equipment.
   */
  onAddClick(): void {
    const center = this.getControlValue('workCenter');
    const office = this.getControlValue('office');
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
    this.global.openDialog('¿Estás seguro de que deseas continuar?').subscribe(
      result => { if (result) {
        this.global.httpOffice.deleteEquipmentInstance(item.id).subscribe({
          next: (response) => {
            console.log('Deleted successfully:', response);
            this.dataService.notifyDataUpdated();
          },
          error: (error) => {
            console.log(error);
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
      item, this.getControlValue('workCenter'),
      this.getControlValue('office'), false
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
  }
}

