import { GlobalModule } from '../../../../global/global.module';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigColumn } from '../../../../../shared/components/table/table.component';
import { AutocompleteComponent } from '../../../../../shared/components/autocomplete/autocomplete.component';
import { Policy } from '../../../../../models/policy.interface';
import { PolicyService } from '../../../../../services/policy/policy.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

@Component({
  selector: 'app-comparison',
  templateUrl: './comparison.component.html',
  styleUrl: './comparison.component.css'
})
export class ComparisonComponent implements OnInit {

  constructor(
    public global: GlobalModule,
    private httpPolicy: PolicyService,
    private fb: FormBuilder
  ) {
    this.form = this.fb.group({
      workCenter: '',
      policy: ''
    });

    this.form.valueChanges.subscribe(() => { this.showTable = false });
  }

  form: FormGroup;
  centerSelectedId: number = 0;

  policySelectedId: number = 0;

  optionsPolicy: string[] = [];
  objectsPolicy: Policy[] = [];

  showTable: boolean = false;
  dataSourceBefore: MatTableDataSource<any> = [][0];
  dataSourceAfter: MatTableDataSource<any> = [][0];
  displayedColumns: ConfigColumn[] = [
    {
      title: 'Día',
      field: 'registerDate'
    },
    {
      title: 'Consumo (Kw/h)',
      field: 'consumption'
    },
    {
      title: 'Costo ($)',
      field: 'cost'
    }
  ];


  ngOnInit(): void {
    this.global.Reset();
    this.global.getWorkCenters();
    this.form.get('workCenter')?.valueChanges.subscribe(() => {
      this.getControl('policy').reset();
      if (this.global.isOptionValid(this.global.centerStringArray, this.form.get('workCenter')?.value)) {
        this.global.findCenterId(this.getControlValue('workCenter'));
        this.getPolicies(this.global.centerSelectedId);
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
   * Handles the click event on the policy component.
   * Checks if a valid center and policy are selected, and if so, sets the table to be active.
   * If not, displays an alert message.
   */
  onClick() {
    if (!this.showTable) {
      if (this.global.isOptionValid(this.global.centerStringArray, this.getControlValue('workCenter')) &&
        this.global.isOptionValid(this.optionsPolicy, this.getControlValue('policy'))) {
        this.showTable = true;
      } else {
        this.showTable = false;
        this.global.openDialog('Por favor, selecciona un Centro de Trabajo y una Política.');
      }
    }
  }

  /**
   * Retrieves policies based on the selected center ID.
   * Updates the optionsPolicy array with the names of the policies.
   * @param centerSelectedId The ID of the selected center.
   */
  getPolicies(centerSelectedId: any) {
    this.httpPolicy.getPolicies(centerSelectedId).subscribe(policies => {
      this.objectsPolicy = policies;
      this.optionsPolicy = policies.map(policy => policy.name);
    });
  }
}
