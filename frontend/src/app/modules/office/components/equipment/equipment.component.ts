import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ConfigColumn } from '../../../../shared/components/table/table.component';

import { MatTableDataSource } from '@angular/material/table';
import { MatPaginator } from '@angular/material/paginator';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.css']
})
export class EquipmentComponent implements OnInit, AfterViewInit {

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      firstSelect: [''],
      secondSelect: [{ value: '', disabled: true }]
    });
  }

  form: FormGroup;
  showTable = false;
  isSecondSelectDisabled = true; // initially inactive
  CenterOptions: any[] = [];
  officeOptions: { id: number; label: string; }[] = [];
  // Example data for the table
  dataSource: MatTableDataSource<any> = new MatTableDataSource([0]);
  @ViewChild(MatPaginator) paginator: MatPaginator = [][0];

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
    this.subscribeToFirstSelectChanges();
    this.getCenterList();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.paginator;
  }

  /**
   * This function subscribes to the changes of the first select control.
   * If the value is true, it enables the second select control.
   * If the value is false, it disables the second select control.
   */
  private subscribeToFirstSelectChanges(): void {
    this.form.get('firstSelect')?.valueChanges.subscribe(value => {
        if (value) {
            this.form.get('secondSelect')?.enable();
        } else {
            this.form.get('secondSelect')?.disable();
        }
    });
  }

  /**
   * Handles the selection change event of the select controls.
   * Shows or hides the table based on the selection.
   */
  onSelectionChange(): void {
    const { firstSelect, secondSelect } = this.form.value;
    if (firstSelect && secondSelect) {
      this.getEquipmentsByOffice(secondSelect);
      this.showTable = true;
    }
  }

  /**
   * Handles the change event of the first select control.
   * Resets the second select control and updates its options based on the selected center.
   * @param event The change event of the first select control.
   */
  onCenterChange(event: any): void {
    const selectedCentroID = event.value;
    this.form.get('secondSelect')?.reset();
    this.getOfficesByCenter(selectedCentroID);
    this.form.get('secondSelect')?.enable();

    this.showTable = false;
  }

  /**
   * This function gets the offices by center ID.
   * It updates the officeOptions based on the selected center.
   * @param centerID The ID of the selected center.
   */
  getOfficesByCenter(centerID : number): void {
    // this is a test
    if (centerID === 1)
      this.officeOptions = [
        { id: 1, label: 'Oficina 1.1' },
        { id: 2, label: 'Oficina 1.2' },
      ];
    else if (centerID === 2)
      this.officeOptions = [
        { id: 3, label: 'Oficina 2.1' },
        { id: 4, label: 'Oficina 2.2' },
      ];
    else {
      this.officeOptions = [
        { id: 5, label: 'Oficina 3.1' },
        { id: 6, label: 'Oficina 3.2' },
      ];
    }
  }

  /**
   * This function retrieves the list of equipment based on the selected office.
   * It updates the dataSource for the MatTable with the list of equipment.
   * @param officeID The ID of the selected office.
   */
  getEquipmentsByOffice(officeID : number): void {
    const equipments =[
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

    this.dataSource = new MatTableDataSource(equipments);
    this.dataSource.paginator = this.paginator;
    console.log(this.dataSource);
  }

  /**
   * Retrieves the list of centers.
   * This function updates the CenterOptions array with the list of available centers.
   */
  getCenterList(): void {
    this.CenterOptions = [
      { id: 1, label: 'Centro 1' },
      { id: 2, label: 'Centro 2' },
      { id: 3, label: 'Centro 3' },
    ];
  }
}
