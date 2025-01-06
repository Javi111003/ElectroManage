import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigColumn } from '../../../../../shared/components/table/table.component';
import { GlobalModule } from '../../../../global/global.module';
import { DataService } from '../../../../../services/data/data.service';
import { PolicyService } from '../../../../../services/policy/policy.service';
import { PolicyInfo } from '../../../../../models/policy.interface';
import { Subscription } from 'rxjs';

declare var bootstrap: any;  // Declaración de bootstrap para evitar errores de compilación
@Component({
  selector: 'app-policy-manage',
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.css'
})
export class ManageComponent implements OnInit {
  private subscriptions: Subscription = new Subscription();

  constructor (
    public global: GlobalModule,
    private policyService: PolicyService,
    private dataService: DataService
  ) {}

  policyStringArray: string[] = [];
  policyObjectArray: PolicyInfo[] = [];

  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: ConfigColumn[] = [
    {
      title: 'Nombre',
      field: 'policyName'
    },
    {
      title: 'Descripción',
      field: 'description'
    },
  ];

  ngOnInit(): void {
    this.getPolicies();
    const sub = this.dataService.dataUpdated$.subscribe(() => {
      this.getPolicies();
    });
    this.subscriptions.add(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  onAddClick(): void {
    this.dataService.setData([null, true]);
    const modal = new bootstrap.Modal(document.getElementById('exampleModal') as HTMLElement);
    modal.show();
  }

  delete(item: any): void {
    this.global.openDialog('¿Estás seguro de que deseas continuar?').subscribe(
      result => { if (result) {
        const policyID = this.findId(this.policyObjectArray, item.policyName);
        this.policyService.deletePolicy(policyID).subscribe({
          next: (response) => {
            console.log('Deleted successfully:', response);
            this.dataService.notifyDataUpdated();
          },
          error: (error) => {
            console.log(error);
          }
        });
      }
    });
  }

  edit(item: any): void {
    this.dataService.setData([item, false]);
    const modal = new bootstrap.Modal(document.getElementById('exampleModal') as HTMLElement);
    modal.show();
  }

  getPolicies(): void {
    this.policyService.getPolicies().subscribe(policies => {
      this.policyObjectArray = policies;
      this.policyStringArray = policies.map(policy => policy.name);
      this.reloadTableData(policies);
    });
  }

  findId(array: PolicyInfo[], option: string): number {
    return array.find(item => item.name === option)?.id!;
  }

  /**
   * Reloads the table data with the provided list of policies.
   * This function updates the data source of the table with the new list of policies,
   * transforming each policy item into a format suitable for display in the table.
   * @param policies The list of policies to be used to reload the table data.
   */
  reloadTableData(policies: PolicyInfo[]): void {
    this.dataSource.data = policies.map(item => ({
      id: item.id,
      policyName: item.name,
      description: item.description
    }));
  }
}
