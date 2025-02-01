import { GlobalModule } from '../../../../global/global.module';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigColumn } from '../../../../../shared/components/table/table.component';
import { PolicyService } from '../../../../../services/policy/policy.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Item } from '../../../../../shared/shared.module';
import { PolicyComparison } from '../../../../../models/policy.interface';
import { RegisterByDay } from '../../../../../models/register.interface';
import { Chart } from 'chart.js/auto';

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
  chart: any;

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

      if (this.chart) {
        this.chart.destroy();
      }

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
      if (this.chart) {
        this.chart.destroy();
      }

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
      const center = this.global.getControlValue(this.form, 'workCenter');
      const policy = this.global.getControlValue(this.form, 'policy');
      if (center && policy && center.id && policy.id) {
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
    this.createChart(comparison);
  }

  /**
   * Creates or updates a chart comparing consumption before and after policy application.
   * This method initializes a new Chart.js line chart that displays the consumption data
   * for both periods on the same graph for easy comparison.
   *
   * @param comparison The comparison data containing before and after consumption records
   */
  createChart(comparison: PolicyComparison): void {
    if (this.chart) {
      this.chart.destroy();
    }
    const maxDays = Math.max(comparison.before.registers.length, comparison.after.registers.length);
    const labels = Array.from({length: maxDays}, (_, i) => `Día ${i + 1}`);
    const beforeData = comparison.before.registers.map(r => r.consumption);
    const afterData = comparison.after.registers.map(r => r.consumption);
    this.chart = new Chart('consumptionChart', {
      type: 'line',
      data: {
        labels: labels,
        datasets: [
          {
            label: 'Antes',
            data: beforeData,
            borderColor: '#FF6384',
            tension: 0.1,
            borderWidth: 2
          },
          {
            label: 'Después',
            data: afterData,
            borderColor: '#36A2EB',
            tension: 0.1,
            borderWidth: 2
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: {
                size: 14
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Consumo (Kw/h)',
              font: {
                size: 14
              }
            }
          },
          x: {
            title: {
              display: true,
              text: 'Días',
              font: {
                size: 14
              }
            }
          }
        }
      }
    });
  }
}
