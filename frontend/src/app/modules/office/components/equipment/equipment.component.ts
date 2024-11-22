import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder } from '@angular/forms';
import { ConfigColumn } from '../../../../shared/components/table/table.component';

import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-equipment',
  templateUrl: './equipment.component.html',
  styleUrls: ['./equipment.component.css']
})
export class EquipmentComponent implements OnInit {

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
  officeOptions: { value: string; label: string; }[] = [];
  // Example data for the table
  dataSource: MatTableDataSource<any> = new MatTableDataSource([
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
  ]);
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
    this.showTable = firstSelect && secondSelect;
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
        { value: 'oficina1', label: 'Oficina 1.1' },
        { value: 'oficina2', label: 'Oficina 1.2' },
      ];
    else if (centerID === 2)
      this.officeOptions = [
        { value: 'oficina3', label: 'Oficina 2.1' },
        { value: 'oficina4', label: 'Oficina 2.2' },
      ];
    else {
      this.officeOptions = [
        { value: 'oficina5', label: 'Oficina 3.1' },
        { value: 'oficina6', label: 'Oficina 3.2' },
      ];
    }
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
