import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigColumn } from '../../../../../shared/components/table/table.component';
import { GlobalModule } from '../../../../global/global.module';
import { DataService } from '../../../../../services/data/data.service';
import { PolicyService } from '../../../../../services/policy/policy.service';
import { PolicyInfo } from '../../../../../models/policy.interface';
import { Subscription } from 'rxjs';
import { Item } from '../../../../../shared/shared.module';
import { SnackbarService } from '../../../../../services/snackbar/snackbar.service';
import { FormControl } from '@angular/forms';
import { API_URL, EXPORT_POLICY } from '../../../../../config/api.config';

declare var bootstrap: any;
@Component({
  selector: 'app-policy-manage',
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.css'
})
export class ManageComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  noResults: boolean = false;
  export: FormControl = [][0];
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

  constructor (
    public global: GlobalModule,
    private policyService: PolicyService,
    private dataService: DataService,
    private snackbar: SnackbarService
  ) {}

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
    this.dataService.setData([null, true, false]);
    const modal = new bootstrap.Modal(document.getElementById('exampleModal') as HTMLElement);
    modal.show();
  }

  exportFunction(): void {
    const userId = this.global.getUserInfo().id;
    const format = this.export.value;
    const route = `${API_URL}${EXPORT_POLICY}?userId=${userId}&format=%22${format}%22`;
    this.global.export(route, "Políticas_de_Eficiencia_Energética", format);
  }

  /**
   * Deletes a policy from the system.
   * This function prompts the user for confirmation before deleting the selected policy.
   * If the user confirms, it deletes the policy from the server and notifies the data service to update the data.
   * If the user cancels, it does nothing.
   * @param item The policy instance to be deleted.
   */
  delete(item: any): void {
    this.global.openDialog('¿Estás seguro de que deseas continuar?', true).subscribe(
      result => { if (result) {
        this.policyService.deletePolicy(item.id).subscribe({
          next: (response) => {
            console.log('Deleted successfully:', response);
            this.snackbar.openSnackBar('Eliminado exitosamente...');
            this.dataService.notifyDataUpdated();
          },
          error: (error) => {
            console.log(error);
            this.snackbar.openSnackBar('Error al eliminar, intente de nuevo...');
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
    this.dataService.setData([item, false, false]);
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

    this.noResults = this.dataSource.data.length == 0;
  }
}
