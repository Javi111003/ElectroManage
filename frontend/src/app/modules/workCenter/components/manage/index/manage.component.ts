import { AdminArea } from './../../../../../models/workCenter.interface';
import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigColumn } from '../../../../../shared/components/table/table.component';
import { GlobalModule } from '../../../../global/global.module';
import { DataService } from '../../../../../services/data/data.service';
import { SnackbarService } from '../../../../../services/snackbar/snackbar.service';
import { CenterDetails } from '../../../../../models/workCenter.interface';
import { Subscription } from 'rxjs';

declare var bootstrap: any;

@Component({
  selector: 'app-center-manage',
  templateUrl: './manage.component.html',
  styleUrl: './manage.component.css'
})
export class ManageComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();

  centerStringArray: string[] = [];
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

  constructor (
    public global: GlobalModule,
    private dataService: DataService,
    private snackbarService: SnackbarService
  ) {}

  ngOnInit(): void {
    this.getCenters();
    const sub = this.dataService.dataUpdated$.subscribe(() => {
      this.getCenters();
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
    this.dataService.setData([null, true]);
    const modal = new bootstrap.Modal(document.getElementById('exampleModal') as HTMLElement);
    modal.show();
  }

  delete(item: any): void {
    this.global.openDialog('¿Estás seguro de que deseas continuar?').subscribe(
      result => { if (result) {
        this.global.httpCenter.deleteCenter(item.id).subscribe({
          next: (response) => {
            console.log('Deleted successfully:', response);
            this.dataService.notifyDataUpdated();
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
   * Handles the "Edit" button click event.
   * This function sets the current data to the selected item and sets a flag to false, indicating an edit operation.
   * It then opens the modal for editing an existing work center.
   * @param item The work center instance to be edited.
   */
  edit(item: any): void {
    this.dataService.setData([item, false]);
    const modal = new bootstrap.Modal(document.getElementById('exampleModal') as HTMLElement);
    modal.show();
  }

  /**
   * Retrieves the list of work centers from the server and updates the component's state.
   * This function sends a request to the server to fetch the list of work centers.
   * Upon receiving the response, it updates the component's state by setting the centerObjectArray
   * and centerStringArray properties.
   * It also calls the reloadTableData function to update the table with the new data.
   */
  getCenters(): void {
    this.global.httpCenter.getCenterDetailsList().subscribe(centers => {
      this.centerObjectArray = centers;
      this.centerStringArray = centers.map(center => center.name);
      this.reloadTableData(centers);
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
