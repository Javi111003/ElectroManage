import { GlobalModule } from '../../../../global/global.module';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigColumn } from '../../../../../shared/components/table/table.component';
import { PolicyService } from '../../../../../services/policy/policy.service';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Item } from '../../../../../shared/shared.module';
import { PolicyApplied, PolicyComparison } from '../../../../../models/policy.interface';
import { RegisterByDay } from '../../../../../models/register.interface';

@Component({
  selector: 'app-comparison',
  templateUrl: './comparison.component.html',
  styleUrl: './comparison.component.css'
})
export class ComparisonComponent implements OnInit {
  form: FormGroup;
  policies: Item[] = [];
  showTable: boolean = false;
  registersBefore: RegisterByDay[] = [];
  registersAfter: RegisterByDay[] = [];
  noResultsBefore: boolean = false;
  noResultsAfter: boolean = false;
  footerTableBefore: any[] = [];
  footerTableAfter: any[] = [];
  dataSourceBefore: MatTableDataSource<any> = new MatTableDataSource();
  dataSourceAfter: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: ConfigColumn[] = [
    {
      title: 'Día',
      field: 'date'
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
          this.getPolicies(id);
        }
      }
    });

    this.form.get('policy')?.valueChanges.subscribe(() => {
      const policy = this.global.getControlValue(this.form, 'policy');
      if (policy) {
        if (policy.id) {
          const centerID = this.global.getControlValue(this.form, 'workCenter').id;
          const len = policy.name.length;
          const date = policy.name.substring(len - 11, len - 1);
          this.getBeforeAfterInfo(policy.id, centerID, date);
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
  onConsultClick() {
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
   * @param centerID The ID of the selected center.
   */
  getPolicies(centerID: any) {
    this.httpPolicy.getPoliciesByCenter(centerID).subscribe(policies => {
      this.policies = policies.map(policy => {
        return {
          id: policy.efficiencyPolicy.policyId,
          name: `${policy.efficiencyPolicy.policyName} [${policy.applyingDate.substring(0, 10)}]`
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
  getBeforeAfterInfo(policyID: number, centerID: number, date: string): void {
    this.httpPolicy.getPolicyComparison(centerID, policyID, date).subscribe(comparison => {
      this.registersAfter = comparison.after.registers;
      this.registersBefore = comparison.before.registers;
      this.reloadTables(comparison);
    });
  }

  /**
   * Reloads the table data with the provided list of registers.
   * This function updates the data sources of the tables with the new list of registers,
   * before and after the appliance of a policy.
   * @param comparison The registers after and before the policy appliance.
   */
  reloadTables(comparison: PolicyComparison): void {
    this.dataSourceBefore.data = comparison.before.registers.map(register => ({
      date: register.date.substring(0, 10),
      consumption: register.consumption.toFixed(2),
      cost: register.cost.toFixed(2)
    }));
    this.footerTableBefore = [
      'Total',
      comparison.before.totalConsumption.toFixed(2),
      comparison.before.totalCost.toFixed(2)
    ];

    this.dataSourceAfter.data = comparison.after.registers.map(register => ({
      date: register.date.substring(0, 10),
      consumption: register.consumption.toFixed(2),
      cost: register.cost.toFixed(2)
    }));
    this.footerTableAfter = [
      'Total',
      comparison.after.totalConsumption.toFixed(2),
      comparison.after.totalCost.toFixed(2)
    ];

    this.noResultsBefore = this.dataSourceBefore.data.length == 0;
    this.noResultsAfter = this.dataSourceAfter.data.length == 0;
  }
}
