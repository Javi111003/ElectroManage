import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigColumn } from '../../../../../shared/components/table/table.component';
import { GlobalModule } from '../../../../global/global.module';
import { DataService } from '../../../../../services/data/data.service';
import { SnackbarService } from '../../../../../services/snackbar/snackbar.service';
import { CenterDetails } from '../../../../../models/workCenter.interface';
import { Subscription } from 'rxjs';
import { UserLogged } from '../../../../../models/credential.interface';

declare var bootstrap: any;

@Component({
  selector: 'app-center-manage',
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.css'
})
export class ManageComponent implements OnInit, OnDestroy {
  constructor (
    public global: GlobalModule,
    private dataService: DataService,
    private snackbarService: SnackbarService
  ) {}

  private subscriptions: Subscription = new Subscription();
  centerObjectArray: CenterDetails[] = [];
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
      title: 'Tipo de instalación',
      field: 'instalationType'
    },
    {
      title: 'Ubicación',
      field: 'address'
    },
    {
      title: 'Límite Mensual',
      field: 'monthlyLimit'
    }
  ];

  ngOnInit(): void {
    const user: UserLogged = this.global.getUserInfo();

    if (user.roles.includes('Admin'))
      this.getCenters();
    else
      this.getManagerCenter(user.info.company.id);

    const sub = this.dataService.dataUpdated$.subscribe(() => {
      const user: UserLogged = this.global.getUserInfo();

      if (user.roles.includes('Admin'))
        this.getCenters();
      else
        this.getManagerCenter(user.info.company.id);
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
            this.dataService.notifyDataUpdated();
            this.deleteLocation(item);
            this.snackbarService.openSnackBar('Eliminado exitosamente...');
          },
          error: (error) => {
            console.log(error);
            this.snackbarService.openSnackBar('Error al eliminar, intente de nuevo...');
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
        if (item.managementTeam)
          this.deleteTeam(item.managementTeam.companyId, item.managementTeam.id)
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
   * Handles the "Edit" button click event.
   * This function sets the current data to the selected item and sets a flag to false, indicating an edit operation.
   * It then opens the modal for editing an existing work center.
   * @param item The work center instance to be edited.
   */
  edit(item: any): void {
    this.dataService.setData([item, false, false]);
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
    this.dataSource.data = centers.map(item => ({
      id: item.id,
      location: item.location,
      adminArea: item.administrativeArea,
      instalType: item.installationType,
      team: item.managementTeam,
      name: item.name,
      address: item.location.addressDetails,
      adminAreaName: item.administrativeArea.name,
      instalationType: item.installationType.name,
      monthlyLimit: item.consumptionLimit
    }));
  }
}
