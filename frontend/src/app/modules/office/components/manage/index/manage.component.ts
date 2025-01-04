import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigColumn } from '../../../../../shared/components/table/table.component';
import { DataService } from '../../../../../services/data/data.service';
import { GlobalModule } from '../../../../global/global.module';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { Subscription } from 'rxjs';

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
    private dataService: DataService
  ) {
    this.form = this.fb.group({
      workCenter: ''
    });

    this.form.valueChanges.subscribe(() => { this.showTable = false });

    this.getControl('workCenter').valueChanges.subscribe(() => {
      const center = this.getControlValue('workCenter');
      if (this.global.isOptionValid(this.global.centerStringArray, center)) {
        this.global.findCenterId(center);
        this.global.getOfficesByCenter(this.global.centerSelectedId);
      }
    });
  }

  ngOnInit() {
    this.global.Reset();
    this.global.getWorkCenters();

    const sub = this.dataService.dataUpdated$.subscribe(() => {
      const center = this.getControlValue('workCenter');
      if (this.global.isOptionValid(this.global.centerStringArray, center)) {
        this.global.getOfficesByCenter(this.global.centerSelectedId).subscribe(offices => {
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
   * This function is used to get the form control by its name.
   * @param control The name of the form control.
   * @returns The form control with the specified name.
   */
  getControl(control: string): FormControl {
    return this.form.get(control) as FormControl;
  }

  /**
   * This function is used to get the value of a form control by its name.
   * @param control The name of the form control.
   * @returns The value of the form control with the specified name.
   */
  getControlValue(control: string): any {
    return this.form.get(control)?.value;
  }

  /**
   * This function is used to handle the "Add" button click event.
   * It retrieves the value of 'workCenter' from the form control,
   * sets it along with a null value and a boolean indicating it's a new entry,
   * and then opens the modal for adding a new equipment.
   */
  onAddClick(): void {
    const center = this.getControlValue('workCenter');
    this.dataService.setData([null, center, true]);
    console.log(this.dataService.currentData);
    const modal = new bootstrap.Modal(document.getElementById('exampleModal') as HTMLElement);
    modal.show();
  }

   /**
   * Handles the "Consultar" button click event.
   * Checks if both center and office are selected before showing the table.
   * If not, displays an alert message.
   */
   onConsultClick(condition: boolean = !this.showTable): void {
    if (condition) {
      const center = this.getControlValue('workCenter');
      if (this.global.isOptionValid(this.global.centerStringArray, center)) {
        this.reloadTableData(this.global.officeObjectArray)
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
    this.global.openDialog('¿Estás seguro de que deseas continuar?').subscribe(
      result => { if (result) {
        this.global.findOfficeId(item.officeName);
        this.global.httpOffice.deleteOffice(this.global.officeSelectedId).subscribe({
          next: (response) => {
            console.log('Deleted successfully:', response);
            this.dataService.notifyDataUpdated();
          },
          error: (error) => {
            this.global.openDialog(error.error.errors[0].reason);
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
    this.global.findOfficeId(item.officeName);
    this.dataService.setData([item, this.getControlValue('workCenter'), false]);
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
      officeName: item.name,
      description: item.description
    }));
  }
}
