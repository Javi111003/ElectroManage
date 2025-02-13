import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigColumn } from '../../../../../shared/components/table/table.component';
import { GlobalModule } from '../../../../global/global.module';
import { DataService } from '../../../../../services/data/data.service';
import { SnackbarService } from '../../../../../services/snackbar/snackbar.service';
import { CenterDetails } from '../../../../../models/workCenter.interface';
import { Subscription } from 'rxjs';
import { UserLogged } from '../../../../../models/credential.interface';
import { UserService } from '../../../../../services/user/user.service';
import { FormControl } from '@angular/forms';
import { API_URL, EXPORT_CENTER } from '../../../../../config/api.config';

declare var bootstrap: any;

@Component({
  selector: 'app-center-manage',
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.css'
})
export class ManageComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  centerObjectArray: CenterDetails[] = [];
  noResults: boolean = false;
  export: FormControl = new FormControl();
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: ConfigColumn[] = [
    {
      title: 'Nombre',
      field: 'name'
    },
    {
      title: 'Área Administrativa',
      field: 'adminAreaName'
    },
    {
      title: 'Tipo de Instalación',
      field: 'instalationType'
    },
    {
      title: 'Ubicación',
      field: 'address'
    },
    {
      title: 'Política de Eficiencia Actual',
      field: 'efficiencyPolicy'
    },
    {
      title: 'Límite Mensual',
      field: 'monthlyConsumptionLimit'
    },
    {
      title: 'Equipo Responsable',
      field: 'teamMembers'
    }
  ];

  constructor (
    public global: GlobalModule,
    private dataService: DataService,
    private snackbar: SnackbarService,
    private httpUser: UserService
  ) {}

  ngOnInit(): void {
    const user: UserLogged = this.global.getUserInfo();

    if (user.roles.includes('Admin'))
      this.getCenters();
    else
      this.getManagerCenter(user.company.id);

    const sub = this.dataService.dataUpdated$.subscribe(() => {
      const user: UserLogged = this.global.getUserInfo();

      if (user.roles.includes('Admin'))
        this.getCenters();
      else
        this.getManagerCenter(user.company.id);
    });
    this.subscriptions.add(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * Handles the "Add" button click event.
   * This function sets the current data to null, indicating a new entry, and sets a flag to true.
   * It then opens the modal for adding a new work center.
   */
  onAddClick(): void {
    this.dataService.setData([null, true, false]);
    const modal = new bootstrap.Modal(document.getElementById('exampleModal') as HTMLElement);
    modal.show();
  }

  /**
   * Exports the work center data in the specified format.
   *
   * This function retrieves the user ID from the global user information,
   * gets the export format from the export form control, constructs the
   * export route URL, and then calls the global export function with the
   * constructed route, a predefined file name, and the selected format.
   */
  exportFunction(): void {
    const userId = this.global.getUserInfo().id;
    const format = this.export.value.name;
    const route = `${API_URL}${EXPORT_CENTER}?userId=${userId}&format=${format}`;
    this.global.export(route, "Centros_de_Trabajo", format);
  }

  /**
   * Deletes a work center and its associated data.
   *
   * This function prompts the user for confirmation before proceeding to delete
   * the specified work center. Upon confirmation, it attempts to delete the center
   * and, if successful, notifies the data service and displays a success message.
   * If the deletion fails, an error message is displayed. After deleting the center,
   * it proceeds to delete the associated location.
   *
   * @param item The work center object to be deleted.
   */
  delete(item: any): void {
    this.global.openDialog('¿Estás seguro de que deseas continuar?', true).subscribe(
      result => { if (result) {
        this.global.httpCenter.deleteCenter(item.id).subscribe({
          next: (response) => {
            console.log('Deleted successfully:', response);
            this.deleteLocation(item);
            this.deleteUsers(item.id);
            this.snackbar.openSnackBar('Eliminado exitosamente...');
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
   * Deletes the location associated with a work center.
   *
   * This function attempts to delete the location of the specified work center.
   * If successful, it checks for an associated management team and proceeds to delete it.
   *
   * @param item The work center object whose location is to be deleted.
   */
  deleteLocation(item: any): void {
    this.global.httpCenter.deletelocation(item.location.id).subscribe({
      next: (response) => {
        console.log('Location Deleted successfully:', response);
        if (item.team)
          this.deleteTeam(item.team.id, item.team.companyId);
        this.deleteFormula(item.costFormula.id);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  /**
   * Deletes a formula associated with a work center.
   *
   * This function attempts to delete the formula identified by the given formula ID.
   * It logs the result of the operation.
   *
   * @param formulaID The ID of the formula to be deleted.
   */
  deleteFormula(formulaID: number): void {
    this.global.httpCenter.deleteFormula(formulaID).subscribe({
      next: (response) => {
        this.dataService.notifyDataUpdated();
        console.log('Formula Deleted successfully:', response);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  /**
   * Deletes a management team associated with a work center.
   *
   * This function attempts to delete the management team identified by the given
   * team ID and center ID. It logs the result of the operation.
   *
   * @param teamID The ID of the management team to be deleted.
   * @param centerID The ID of the work center associated with the management team.
   */
  deleteTeam(teamID: number, centerID: number): void {
    this.global.httpCenter.deleteManagementTeam(centerID, teamID).subscribe({
      next: (response) => {
        console.log('Team Deleted successfully:', response);
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  /**
   * Deletes all users associated with the center.
   *
   * This function attempts to delete all users identified by the given
   * center ID. It logs the result of the operation.
   *
   * @param centerID The ID of the work center associated with the users.
   */
  deleteUsers(centerID: number): void {
    this.httpUser.getUserByCompany(centerID).subscribe(users => {
      for (let i = 0; i < users.length; i++) {
        this.httpUser.deleteUser(users[i].id).subscribe({
          next: (response) => {
            console.log(`User ${users[i].username} deleted successfully:`, response);
          },
          error: (error) => {
            console.log(error);
          }
        });
      }
    });
  }

  /**
   * Handles the "Edit" button click event.
   * This function sets the current data to the selected item and sets a flag to false, indicating an edit operation.
   * It then opens the modal for editing an existing work center.
   * @param item The work center instance to be edited.
   */
  edit(item: any): void {
    let data = item;
    if (!this.global.getUserInfo().roles.includes('Admin')) {
      data = this.dataSource.data[0];
    }
    this.dataService.setData([data, false, false]);
    const modal = new bootstrap.Modal(document.getElementById('exampleModal') as HTMLElement);
    modal.show();
  }

  /**
   * Retrieves the list of work centers from the server and updates the component's state.
   * This function sends a request to the server to fetch the list of work centers.
   * Upon receiving the response, it updates the component's state by setting the centerObjectArray.
   * It also calls the reloadTableData function to update the table with the new data.
   */
  getCenters(): void {
    this.global.httpCenter.getCenterDetailsList().subscribe(centers => {
      this.centerObjectArray = centers;
      this.reloadTableData(centers);
    });
  }

  /**
   * Retrieves the details of a specific work center by its ID.
   * This function sends a request to the server to fetch the details of the work center
   * identified by the given center ID. Upon receiving the response, it updates the component's
   * state by setting the centerObjectArray with the retrieved center details and reloads the table data.
   * @param centerID The ID of the work center to be retrieved.
   */
  getManagerCenter(centerID: number): void {
    this.global.httpCenter.getCenterById(centerID).subscribe(center => {
      this.centerObjectArray = [center];
      this.reloadTableData([center]);
    });
  }

  /**
   * Reloads the table data with the provided list of work centers.
   * This function updates the data source of the table with the new list of work centers,
   * transforming each center item into a format suitable for display in the table.
   * @param centers The list of work centers to be used to reload the table data.
   */
  reloadTableData(centers: CenterDetails[]): void {
    this.dataSource.data = centers.map(item => {
      const team = item.managementTeam;
      const policy = item.currentEfficiencyPolicy;
      let members = "-";
      let efficiencyPolicy = "-";
      if (team) {
        const users = team.members.map(member => member.userName);
        members = users.join(", ");
        members.substring(0, members.length - 2);
      }
      if (policy) {
        efficiencyPolicy = policy.efficiencyPolicy.policyName;
      }
      return ({
      id: item.id,
      location: item.location,
      adminArea: item.administrativeArea,
      instalType: item.installationType,
      team: team,
      teamMembers: members,
      name: item.name,
      address: item.location.addressDetails,
      adminAreaName: item.administrativeArea.name,
      instalationType: item.installationType.name,
      monthlyConsumptionLimit: item.consumptionLimit,
      costFormula: item.currentCostFormula,
      policy: policy,
      efficiencyPolicy: efficiencyPolicy
    })});

    this.noResults = this.dataSource.data.length == 0;
  }
}
