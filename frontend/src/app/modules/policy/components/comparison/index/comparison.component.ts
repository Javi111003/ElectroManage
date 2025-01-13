import { GlobalModule } from '../../../../global/global.module';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigColumn } from '../../../../../shared/components/table/table.component';
import { AutocompleteComponent } from '../../../../../shared/components/autocomplete/autocomplete.component';
import { PolicyByCompany } from '../../../../../models/policy.interface';
import { PolicyService } from '../../../../../services/policy/policy.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Item } from '../../../../../shared/shared.module';

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

    if (!this.global.getUserInfo().roles.includes('Admin')) {
      const name = this.global.getUserInfo().info.company.name;
      const id = this.global.getUserInfo().info.company.id;
      const workCenter: Item = {
        id: id,
        name: name
      };
      this.getControl('workCenter').setValue(workCenter);
      this.getPolicies(id);
    }

    this.form.valueChanges.subscribe(() => { this.showTable = false });
  }

  form: FormGroup;

  optionsPolicy: string[] = [];
  policies: Item[] = [];
  objectsPolicy: PolicyByCompany[] = [];

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
      const id = this.getControlValue('workCenter').id;
      if (id) {
        this.getPolicies(id);
      }
    });
  }

  /**
   * Retrieves the FormControl object for a given control name from the form.
   * This method is used to access and manipulate form controls dynamically.
   * @param control The name of the control to retrieve.
   * @returns The FormControl object associated with the specified control name.
   */
  getControl(control: string): FormControl {
    return this.form.get(control) as FormControl;
  }

  /**
   * Retrieves the value of a given control from the form.
   * This method is used to access the current value of a form control.
   * @param control The name of the control to retrieve the value from.
   * @returns The current value of the specified control.
   */
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
      if (this.getControlValue('workCenter').id && this.getControlValue('policy').id){
        this.showTable = true;
      } else {
        this.showTable = false;
        this.global.openDialog('Por favor, selecciona un Centro de Trabajo y una Política válidos.');
      }
    }
  }

  /**
   * Retrieves policies based on the selected center ID.
   * Updates the optionsPolicy array with the names of the policies.
   * @param centerSelectedId The ID of the selected center.
   */
  getPolicies(centerSelectedId: any) {
    this.httpPolicy.getPoliciesByCenter(centerSelectedId).subscribe(policies => {
      this.objectsPolicy = policies;
      this.optionsPolicy = policies.map(policy => policy.name);
      this.policies = policies.map(policy => {
        return {
          id: policy.id,
          name: policy.name
        }
      })
    });
  }
}
