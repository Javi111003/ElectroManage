import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfigColumn } from '../../../../shared/components/table/table.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { OfficeService } from '../../../../services/office/office.service';
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

  officeSelected: string = '';
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
  }

  /** * Finds the ID of the selected office based on its name.
  * @param officeSelected The name of the selected office.
  */
  findOfficeId(): void {
    const officeSelected = this.officeSelected;
    this.officeSelectedId = this.global.officeObjectArray.find(item => item.name === officeSelected)?.id;
  }

  /**
   * This function retrieves the list of equipment based on the selected office.
   * It updates the dataSource for the MatTable with the list of equipment.
   */
  getEquipmentsByOffice(): void {
    this.httpOffice.getEquipmentList(this.global.centerSelectedId, this.officeSelectedId)
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
   * Handles the selection of an office option.
   * Updates the officeSelected property and checks if both office and center are selected.
   * If both are selected, it shows the table and retrieves the equipment for the selected office.
   * @param option The selected office option.
   */
  handleOptionSelected(option: any) {
    this.officeSelected = option;
    this.findOfficeId();
    this.getEquipmentsByOffice();
  }

  /** * Handles the "Consultar" button click event.
  * Checks if both center and office are selected before showing the table.
  * If not, displays an alert message.
  */
  onConsultClick(): void {
    if (this.global.isOptionValid(this.global.centerStringArray, this.centerSelected) &&
        this.global.isOptionValid(this.global.officeStringArray, this.officeSelected)) {
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

    if (this.global.isOptionValid(this.global.centerStringArray, this.centerSelected)) {
      this.global.findCenterId(this.centerSelected);
      this.global.getOfficesByCenter(this.global.centerSelectedId);
    } else if (this.officeAutocomplete) {
      this.officeAutocomplete.resetControl();
      this.global.officeStringArray = [];
    }

    this.showTable = false;
    this.officeSelected = null!;
    this.officeSelectedId = 0;
  }
}

