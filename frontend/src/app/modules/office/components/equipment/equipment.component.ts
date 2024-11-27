import { Component, OnInit, ViewChild } from '@angular/core';
import { ConfigColumn } from '../../../../shared/components/table/table.component';
import { FormGroup, FormBuilder } from '@angular/forms';
import { MatTableDataSource } from '@angular/material/table';
import { OfficeService } from '../../../../services/office/office.service';
import { WorkCenter } from '../../../../models/workCenter.interface';
import { Office } from '../../../../models/office.interface';
import { WorkCenterService } from '../../../../services/workCenter/work-center.service';
import { Equipment } from '../../../../models/equipment.interface';
import { AutocompleteComponent } from '../../../../shared/components/autocomplete/autocomplete.component';


export interface TableItem {
  id: string;
  name: string;
  useFrequency: string;
  maintenanceStatus: string;
  brand: string;
  model: string;
  efficiency: number;
  equipmentType: string;
}

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
    private httpCenter: WorkCenterService
  ) {
    this.form = this.fb.group({
      firstSelect: [''],
      secondSelect:['']
    }); 
  }
  form: FormGroup;
  showTable = false;
  centerOptions: string[] = [];
  officeOptions: string[] = [];

  centerObjects: WorkCenter[] = [];
  officeObjects: Office[] = [];

  centerSelected: string = '';
  centerSelectedId: number = 0;

  officeSelected: string = '';
  officeSelectedId: number = 0;

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
    this.getCenterList();
  }

  /**
   * Handles the change event of the first select control.
   * Resets the second select control and updates its options based on the selected center.
   * @param event The change event of the first select control.
   */
  onCenterChange(event: any): void {
    this.centerSelected = event;
    this.centerSelectedId = this.findCenterId(this.centerSelected);
    this.getOfficesByCenter();
    this.showTable = false;
    this.officeSelected = null!;
    this.officeSelectedId = 0;
    this.officeAutocomplete.resetControl();
  }

  /** * Finds the ID of the selected center based on its name.
  * @param centerSelected The name of the selected center.
  * @returns The ID of the selected center.
  */
  findCenterId(centerSelected: string): number {
    const id: number | any = this.centerObjects.find(item => item.name === centerSelected)?.id;
    return id;
  }

  /** * Finds the ID of the selected office based on its name.
  * @param officeSelected The name of the selected office.
  * @returns The ID of the selected office.
  */
  findOfficeId(officeSelected: string): number {
    const id: number | any = this.officeObjects.find(item => item.name === officeSelected)?.id;
    return id;
  }

  /**
   * This function gets the offices by center ID.
   * It updates the officeOptions based on the selected center.
   */
  getOfficesByCenter(): void {
    this.httpOffice.getOfficeList(this.centerSelectedId).subscribe(offices => {
      this.officeObjects = offices;
      this.officeOptions = offices.map(item => item.name);
    })
  }

  /**
   * This function retrieves the list of equipment based on the selected office.
   * It updates the dataSource for the MatTable with the list of equipment.
   */
  getEquipmentsByOffice(): void {
    this.httpOffice.getEquipmentList(this.centerSelectedId, this.officeSelectedId)
      .subscribe(equipments => {
        let tableitems: TableItem[] = equipments.map(item => ({
          id: `${item.companyId}${item.officeId}${item.id}`,
          name: item.name,
          useFrequency: item.useFrequency,
          maintenanceStatus: item.maintenanceStatus,
          brand: item.brand,
          model: item.model,
          efficiency: item.efficency,
          equipmentType: item.equipmentType
        }));
        console.log(equipments[0].efficency)
        tableitems.forEach(item => console.log(item));
        this.dataSource.data = tableitems;
      })
  }

  /**
   * Retrieves the list of centers.
   * This function updates the CenterOptions array with the list of available centers.
   */
  getCenterList(): void {
    this.httpCenter.getWorkCenterList().subscribe(workCenters => {
      this.centerObjects = workCenters;
      this.centerOptions = workCenters.map(item => item.name);
    })
  }

  /**
   * Handles the selection of an office option.
   * Updates the officeSelected property and checks if both office and center are selected.
   * If both are selected, it shows the table and retrieves the equipment for the selected office.
   * @param option The selected office option.
   */
  handleOptionSelected(option: any) {
    this.officeSelected = option;
    this.officeSelectedId = this.findOfficeId(option);
  }

  /** * Handles the "Consultar" button click event.
  * Checks if both center and office are selected before showing the table.
  * If not, displays an alert message.
  */
  onConsultClick(): void {
    if (this.centerSelected && this.officeSelected) {
      this.showTable = true;
      this.centerSelectedId = this.findCenterId(this.centerSelected);
      this.getEquipmentsByOffice();
    } else {
      this.showTable = false;
      alert('Por favor, selecciona un Centro de Trabajo y una Oficina.');
    }
  }
  onOfficeInputModified(value: string): void {
    this.centerSelected=value;
    console.log(this.centerSelected);
    this.getOfficesByCenter();
    this.showTable = false;
    this.officeSelected = null!;
    this.officeSelectedId = 0;
    this.officeAutocomplete.resetControl();
    // Aquí puedes ejecutar cualquier lógica adicional.
  }
}

