import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ConfigColumn } from '../../../../shared/components/table/table.component';
import { MatTableDataSource } from '@angular/material/table';
import { OfficeService } from '../../../../services/office/office.service';
import { WorkCenter } from '../../../../models/workCenter.interface';
import { Office } from '../../../../models/office.interface';
import { of } from 'rxjs';
import { WorkCenterService } from '../../../../services/workCenter/work-center.service';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.css']
})
export class EquipmentComponent implements OnInit {

  constructor(
    private fb: FormBuilder,
    private httpOffice: OfficeService,
    private httpCenter: WorkCenterService
  ) {
    this.form = this.fb.group({
      firstSelect: [''],
    });
  }

  form: FormGroup;
  showTable = false;
  centerOptions: string[] = [];
  officeOptions: string[] = [];
  centerObjects: WorkCenter[] = [];
  officeObjects: Office[] = [];
  centerSelected: string = '';
  officeSelected: string = '';
  // Example data for the table
  dataSource: MatTableDataSource<any> = new MatTableDataSource([0]);

  // Table Columns
  displayedColumns: ConfigColumn[] = [
    {
      title: 'No.',
      field: 'position'
    },
    {
      title: 'Name',
      field: 'name'
    },
    {
      title: 'Symbol',
      field: 'symbol'
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
    const selectedCentroID = event;
    this.centerSelected = selectedCentroID;
    this.getOfficesByCenter(0);
    this.showTable = false;
    this.officeSelected = ''; // Reset office selection when center changes
  }

  /**
   * This function gets the offices by center ID.
   * It updates the officeOptions based on the selected center.
   * @param centerID The ID of the selected center.
   */
  getOfficesByCenter(centerID: number): void {
    this.httpOffice.getOfficeList().subscribe(offices => {
      this.officeObjects = offices;
      this.officeOptions = offices.map(item => item.name);
    })
  }

  /**
   * This function retrieves the list of equipment based on the selected office.
   * It updates the dataSource for the MatTable with the list of equipment.
   * @param officeID The ID of the selected office.
   */
  getEquipmentsByOffice(office: string): void {
    const equipments = [
      { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
      { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
      { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
      { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
      { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
      { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
      { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
      { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
      { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
      { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
    ];
    this.dataSource.data = equipments;
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
    if (this.officeSelected && this.centerSelected) {
      this.showTable = true; // Show table only when both are selected
      this.getEquipmentsByOffice(this.officeSelected); // Get the equipment for the selected office
    }
  }
}

