import { Component, IterableDiffers, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigColumn } from '../../../../../shared/components/table/table.component';
import { DataService } from '../../../../../services/data/data.service';
import { GlobalModule } from '../../../../global/global.module';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';
import { Item } from '../../../../../shared/shared.module';
import { SnackbarService } from '../../../../../services/snackbar/snackbar.service';
import { API_URL, EXPORT_OFFICE } from '../../../../../config/api.config';

declare var bootstrap: any;
@Component({
  selector: 'app-office-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  form: FormGroup;
  showTable: boolean = false;
  noResults: boolean = false;
  export: FormControl = [][0];
  dataSource: MatTableDataSource<any> = new MatTableDataSource();
  displayedColumns: ConfigColumn[] = [
    {
      title: 'Nombre',
      field: 'officeName'
    },
    {
      title: 'Descripción',
      field: 'description'
    }
  ];

  constructor(
    private fb: FormBuilder,
    public global: GlobalModule,
    private dataService: DataService,
    private snackbar: SnackbarService
  ) {
    this.form = this.fb.group({
      workCenter: ''
    });

    this.form.valueChanges.subscribe(() => {
      this.showTable = false;
      this.dataSource.data = [];
    });

    if (!this.global.getUserInfo().roles.includes('Admin')) {
      const userInfo = this.global.getUserInfo();
      if (userInfo && userInfo.company) { // Agregar verificación
        const name = userInfo.company.name;
        const id = userInfo.company.id;
        const workCenter: Item = {
          id: id,
          name: name
        };
        this.global.getControl(this.form, 'workCenter').setValue(workCenter);
        this.global.getOfficesByCenter(id).subscribe(offices => {
          this.reloadTableData(offices);
        });
      }
    }

    this.global.getControl(this.form, 'workCenter').valueChanges.subscribe(() => {
      const id = this.global.getControlValue(this.form, 'workCenter').id;
      if (id) {
        console.log(id);
        this.global.getOfficesByCenter(id).subscribe(offices => {
          this.reloadTableData(offices);
        });
      }
    });

    console.log(this.showTable)
    console.log(this.noResults)
  }

  ngOnInit() {
    this.global.Reset();
    this.global.getWorkCenters();

    const sub = this.dataService.dataUpdated$.subscribe(() => {
      const id = this.global.getControlValue(this.form, 'workCenter').id;
      if (id) {
        this.global.getOfficesByCenter(id).subscribe(offices => {
          this.reloadTableData(offices);
        });
      }
    });
    this.subscriptions.add(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * This function is used to handle the "Add" button click event.
   * It retrieves the value of 'workCenter' from the form control,
   * sets it along with a null value and a boolean indicating it's a new entry,
   * and then opens the modal for adding a new equipment.
   */
  onAddClick(): void {
    const center = this.global.getControlValue(this.form, 'workCenter');
    this.dataService.setData([null, center, true, false]);
    const modal = new bootstrap.Modal(document.getElementById('exampleModal') as HTMLElement);
    modal.show();
  }

  exportFunction(): void {
    const userId = this.global.getUserInfo().id;
    const centerId = this.global.getControlValue(this.form, "workCenter").id;
    const format = this.export.value;
    const route = `${API_URL}${EXPORT_OFFICE}?userId=${userId}&companyId=${centerId}&format=%22${format}%22`;
    this.global.export(route, "Oficinas", format);
  }

   /**
   * Handles the "Consultar" button click event.
   * Checks if both center and office are selected before showing the table.
   * If not, displays an alert message.
   */
   onConsultClick(condition: boolean = !this.showTable): void {
    if (condition) {
      const id = this.global.getControlValue(this.form, 'workCenter').id;
      if (id) {
        this.showTable = true;
      }
      else {
        this.global.openDialog('Por favor, selecciona un Centro de Trabajo válido.');
      }
    }
  }

  /**
   * Handles the deletion of an office.
   * This function prompts the user for confirmation before deleting the selected office.
   * If the user confirms, it deletes the office from the server and notifies the data service to update the data.
   * If the user cancels, it does nothing.
   * @param item The office instance to be deleted.
   */
  delete(item: any): void {
    this.global.openDialog('¿Estás seguro de que deseas continuar?', true).subscribe(
      result => { if (result) {
        this.global.httpOffice.deleteOffice(item.id).subscribe({
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
   * This function is used to handle the "Edit" button click event.
   * It retrieves the values of 'workCenter' and 'office' from the form controls,
   * sets them along with the selected office item and a boolean indicating it's an edit operation,
   * and then opens the modal for editing an existing office.
   * @param item The office instance to be edited.
   */
  edit(item: any): void {
    this.dataService.setData([item, this.global.getControlValue(this.form, 'workCenter'), false, false]);
    const modalElement = document.getElementById('exampleModal') as HTMLElement;
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }

  /**
   * This function is used to reload the table data.
   * It takes an array of office instances as a parameter and maps them to the data source.
   * The data source is then updated with the new data.
   * @param offices An array of office instances to be mapped to the data source.
   */
  reloadTableData(offices: any[]) {
    this.dataSource.data = offices.map(item => ({
      id: item.id,
      officeName: item.name,
      description: item.description
    }));
    this.noResults = this.dataSource.data.length == 0;
  }
}
