import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigColumn } from '../../../../../shared/components/table/table.component';
import { GlobalModule } from '../../../../global/global.module';
import { DataService } from '../../../../../services/data/data.service';
import { PolicyService } from '../../../../../services/policy/policy.service';
import { PolicyInfo } from '../../../../../models/policy.interface';
import { Subscription } from 'rxjs';
import { Item } from '../../../../../shared/shared.module';

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
  policyArray: Item[] = [];
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

  /**
   * Handles the "Add" button click event.
   * This function sets the current data service with null and a boolean indicating it's a new entry,
   * and then opens the modal for adding a new policy.
   */
  onAddClick(): void {
    this.dataService.setData([null, true]);
    const modal = new bootstrap.Modal(document.getElementById('exampleModal') as HTMLElement);
    modal.show();
  }

  /**
   * Deletes a policy from the system.
   * This function prompts the user for confirmation before deleting the selected policy.
   * If the user confirms, it deletes the policy from the server and notifies the data service to update the data.
   * If the user cancels, it does nothing.
   * @param item The policy instance to be deleted.
   */
  delete(item: any): void {
    this.global.openDialog('¿Estás seguro de que deseas continuar?').subscribe(
      result => { if (result) {
        const policyID = this.global.findID(this.policyArray, item.policyName);
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

  /**
   * Handles the "Edit" button click event for a policy.
   * This function sets the current data service with the selected policy item and a boolean indicating it's an edit operation.
   * It then opens the modal for editing an existing policy.
   * @param item The policy instance to be edited.
   */
  edit(item: any): void {
    this.dataService.setData([item, false]);
    const modal = new bootstrap.Modal(document.getElementById('exampleModal') as HTMLElement);
    modal.show();
  }

  /**
   * Retrieves the list of policies from the server.
   * This function subscribes to the policy service to fetch the list of policies.
   * Once the policies are received, it updates the policyObjectArray and policyStringArray with the new data.
   * It also calls the reloadTableData function to update the table with the new policies.
   */
  getPolicies(): void {
    this.policyService.getPolicies().subscribe(policies => {
      this.policyObjectArray = policies;
      this.policyStringArray = policies.map(policy => policy.policyName);
      this.policyArray = policies.map(policy => {
        return {
          id: policy.policyId,
          name: policy.policyName
        }
      });
      this.reloadTableData(policies);
    });
  }

  /**
   * Reloads the table data with the provided list of policies.
   * This function updates the data source of the table with the new list of policies,
   * transforming each policy item into a format suitable for display in the table.
   * @param policies The list of policies to be used to reload the table data.
   */
  reloadTableData(policies: PolicyInfo[]): void {
    this.dataSource.data = policies.map(item => ({
      id: item.policyId,
      policyName: item.policyName,
      description: item.description
    }));
  }
}
