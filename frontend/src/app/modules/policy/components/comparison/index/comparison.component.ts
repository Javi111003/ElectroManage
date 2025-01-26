import { GlobalModule } from '../../../../global/global.module';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigColumn } from '../../../../../shared/components/table/table.component';
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
      const name = this.global.getUserInfo().company.name;
      const id = this.global.getUserInfo().company.id;
      const workCenter: Item = {
        id: id,
        name: name
      };
      this.global.getControl(this.form, 'workCenter').setValue(workCenter);
      this.getPolicies(id);
    }

    this.form.get('workCenter')?.valueChanges.subscribe(() => {
      this.global.getControl(this.form, 'policy').reset();
      this.policies = [];
      if (this.global.getControlValue(this.form, 'workCenter')) {
        const id = this.global.getControlValue(this.form, 'workCenter').id;
        if (id) {
          this.httpPolicy.getPoliciesByCenter(id).subscribe(policies => {
            this.objectsPolicy = policies;
            this.policies = policies.map(policy => ({
              id: policy.id,
              name: policy.name
            }));
          });
        }
      }
    });

    this.form.get('workCenter')?.valueChanges.subscribe(() => {
      const policy = this.global.getControlValue(this.form, 'policy');
      if (policy) {
        if (policy.id) {
          const centerID = this.objectsPolicy.find(item => item.id === policy.id)!.companyId;
          this.getBeforeAfterInfo(policy.id, centerID);
        }
      }
    });

    this.form.valueChanges.subscribe(() => {
      this.showTable = false;
      this.dataSourceBefore.data = [];
      this.dataSourceAfter.data = [];
    });
  }

  ngOnInit(): void {
    this.global.Reset();
    this.global.getWorkCenters();
    this.form.get('workCenter')?.valueChanges.subscribe(() => {
      this.global.getControl(this.form, 'policy').reset();
      const id = this.global.getControlValue(this.form, 'workCenter').id;
      if (id) {
        this.getPolicies(id);
      }
    });
  }

  /**
   * Handles the click event on the policy component.
   * Checks if a valid center and policy are selected, and if so, sets the table to be active.
   * If not, displays an alert message.
   */
  onClick() {
    if (!this.showTable) {
      if (this.global.getControlValue(this.form, 'workCenter').id && this.global.getControlValue(this.form, 'policy').id) {
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

  /**
   * Retrieves the records of a company before and after applying an efficiency policy.
   * This function is not yet implemented.
   * @param policyID The ID of the policy to apply.
   * @param centerID The ID of the center to which the policy is applied.
   */
  getBeforeAfterInfo(policyID: number, centerID: number): void {
    // not implemented
    console.log("No implementado");
  }
}
