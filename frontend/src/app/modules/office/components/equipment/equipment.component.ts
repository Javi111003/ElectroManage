import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfigColumn } from '../../../../shared/components/table/table.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { OfficeService } from '../../../../services/office/office.service';
import { Equipment } from '../../../../models/equipment.interface';
import { AutocompleteComponent } from '../../../../shared/components/autocomplete/autocomplete.component';
import { GlobalModule } from '../../../global/global.module';


@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.css']
})

export class EquipmentComponent implements OnInit {
  @ViewChild('officeAutocomplete') officeAutocomplete!: AutocompleteComponent;

  constructor(
    private fb: FormBuilder,
    private httpOffice: OfficeService,
    public global: GlobalModule
  ) {
    this.form = this.fb.group({
      firstSelect: [''],
      secondSelect:['']
    });
  }
  form: FormGroup;
  showTable = false;

  centerSelected: string = '';
  centerSelectedId: number | any = 0;

  officeSelected: string = '';
  officeSelectedId: number | any = 0;

  equipments: string[] = [];
  equipmentObjects: Equipment[] = [];

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
  }

  /** * Finds the ID of the selected center based on its name.
  * @param centerSelected The name of the selected center.
  */
  findCenterId(centerSelected: string): void {
    this.centerSelectedId = this.global.centerObjectArray.find(item => item.name === centerSelected)?.id;
  }

  /** * Finds the ID of the selected office based on its name.
  * @param officeSelected The name of the selected office.
  */
  findOfficeId(officeSelected: string): void {
    this.officeSelectedId = this.global.officeObjectArray.find(item => item.name === officeSelected)?.id;
  }

  /**
   * This function retrieves the list of equipment based on the selected office.
   * It updates the dataSource for the MatTable with the list of equipment.
   */
  getEquipmentsByOffice(): void {
    this.httpOffice.getEquipmentList(this.centerSelectedId, this.officeSelectedId)
      .subscribe(equipments => {
        this.dataSource.data = equipments.map(item => ({
          id: `${item.companyId}${item.officeId}${item.id}`,
          name: item.name,
          useFrequency: item.useFrequency,
          maintenanceStatus: item.maintenanceStatus,
          brand: item.brand,
          model: item.model,
          efficiency: item.efficency,
          equipmentType: item.equipmentType
        }));
      });
  }

  /**
   * Handles the selection of an office option.
   * Updates the officeSelected property and checks if both office and center are selected.
   * If both are selected, it shows the table and retrieves the equipment for the selected office.
   * @param option The selected office option.
   */
  handleOptionSelected(option: any) {
    this.officeSelected = option;
    this.findOfficeId(option);
    this.getEquipmentsByOffice();
  }

  /** * Handles the "Consultar" button click event.
  * Checks if both center and office are selected before showing the table.
  * If not, displays an alert message.
  */
  onConsultClick(): void {
    if (this.isOptionValid(this.global.centerStringArray, this.centerSelected) &&
        this.isOptionValid(this.global.officeStringArray, this.officeSelected)) {
      this.showTable = true;
    } else {
      this.showTable = false;
      alert('Por favor, selecciona un Centro de Trabajo y una Oficina.');
    }
  }

  /**
  * Handles the change event of the first select control.
  * Resets the second select control and updates its options based on the selected center.
  * @param event The change event of the first select control.
  */
  onCenterInputModified(value: string): void {
    this.centerSelected = value;

    if (this.isOptionValid(this.global.centerStringArray, this.centerSelected)) {
      this.findCenterId(this.centerSelected);
      console.log(this.centerSelectedId);
      this.global.getOfficesByCenter(this.centerSelectedId);
    }

    this.showTable = false;
    this.officeSelected = null!;
    this.officeSelectedId = 0;
    this.officeAutocomplete.resetControl();
  }

  /** * Checks if the given option exists in the provided array.
  * * This function iterates over the array to check if the specified
  * option is present.
  * @param {string[]} array - The array of strings to search within.
  * @param {string} option - The option to search for in the array.
  * @returns {boolean} - Returns `true` if the option is found, `false` otherwise.
  */
  isOptionValid(array: string[], option: string): boolean {
    for (let index = 0; index < array.length; index++) {
      if (option === array[index])
        return true;
    }

    return false;
  }
}

