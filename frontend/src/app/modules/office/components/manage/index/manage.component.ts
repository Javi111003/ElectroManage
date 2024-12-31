import { OfficeService } from './../../../../../services/office/office.service';
import { Component, OnInit } from '@angular/core';
import { MatTableDataSource } from '@angular/material/table';
import { ConfigColumn } from '../../../../../shared/components/table/table.component';
import { DataService } from '../../../../../services/data/data.service';
import { GlobalModule } from '../../../../global/global.module';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';

declare var bootstrap: any;
@Component({
  selector: 'app-office-manage',
  templateUrl: './manage.component.html',
  styleUrls: ['./manage.component.css']
})
export class ManageComponent implements OnInit {

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
    private dataService: DataService,
    private OfficeService: OfficeService
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

    this.dataService.dataUpdated$.subscribe(() => {
      const center = this.getControlValue('workCenter');
      if (this.global.isOptionValid(this.global.centerStringArray, center)) {
        this.global.getOfficesByCenter(this.global.centerSelectedId).subscribe(offices => {
          this.reloadTableData(offices);
        });
      }
    });
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
        this.dataSource.data = this.global.officeObjectArray.map(item => ({
          officeName: item.name,
          description: item.description
        }))
        this.showTable = true;
      }
      else {
        this.global.openDialog('Por favor, selecciona un Centro de Trabajo válido.');
      }
    }
  }

  delete(): void {
    this.global.openDialog('¿Estás seguro de que deseas continuar?').subscribe(
      result => { if (result) {
        this.global.openDialog('Eliminado');
      }
    });
  }

  edit(item: any): void {
    this.global.findOfficeId(item.officeName);
    this.dataService.setData([item, this.getControlValue('workCenter'), false]);
    const modalElement = document.getElementById('exampleModal') as HTMLElement;
    const modal = new bootstrap.Modal(modalElement);
    modal.show();
  }

  reloadTableData(offices: any[]) {
    console.log(offices);
    this.dataSource.data = offices.map(item => ({
      officeName: item.name,
      description: item.description
    }));
  }
}
