import { Component, OnDestroy, OnInit } from '@angular/core';
import { ConfigColumn } from '../../../../../shared/components/table/table.component';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalModule } from '../../../../global/global.module'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DataService } from '../../../../../services/data/data.service';
import { Item } from '../../../../../shared/shared.module';
import { SnackbarService } from '../../../../../services/snackbar/snackbar.service';
import { Register, RegisterByDay, TotalConsumptionData } from '../../../../../models/register.interface';
import { Subscription } from 'rxjs';
import { RegisterService } from '../../../../../services/register/register.service';
import { API_URL, EXPORT_REGISTER } from '../../../../../config/api.config';

declare var bootstrap: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  form: FormGroup;
  showTable: boolean = false;
  noResults: boolean = false;
  export: FormControl = new FormControl();
  dataSource: MatTableDataSource<any> = new MatTableDataSource([0]);
  footerTable: any[] = [];
  displayedColumns: ConfigColumn[] = [
    {
      title: 'Día',
      field: 'registerDate'
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

  constructor (
    public global: GlobalModule,
    private fb: FormBuilder,
    private dataService: DataService,
    private snackbar: SnackbarService,
    private httpRegister: RegisterService
  ) {
    this.form = this.fb.group({
      startDate: [null],
      endDate: [null],
      workCenter: ''
    });

    if (!this.global.getUserInfo().roles.includes('Admin')) {
      const name = this.global.getUserInfo().company.name;
      const id = this.global.getUserInfo().company.id;
      const workCenter: Item = {
        id: id,
        name: name
      };
      this.global.getControl(this.form, 'workCenter').setValue(workCenter);
    }

    this.form.valueChanges.subscribe(() => {
      this.showTable = false;
      this.dataSource.data = [];
    });
  }

  ngOnInit(): void {
    this.global.Reset();
    this.global.getWorkCenters();
    this.form.get('startDate')?.valueChanges.subscribe(() => {
      this.global.getControl(this.form, 'endDate').reset();
    });

    const sub = this.dataService.dataUpdated$.subscribe(() => {
      const id = this.global.getControlValue(this.form, 'workCenter').id;
      const initDate = this.global.getControlValue(this.form, 'startDate');
      const endDate = this.global.getControlValue(this.form, 'endDate');
      if (id && initDate && endDate) {
        this.getRegistersByCenterId(id, initDate, endDate);
      }
    });
    this.subscriptions.add(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * Exports the register data based on the selected user, work center, and date range.
   *
   * This function retrieves the user ID, work center ID, start date, and end date from the form,
   * formats the dates, constructs the export URL with the necessary parameters, and triggers
   * the export process.
   */
  exportFunction(): void {
    const userId = this.global.getUserInfo().id;
    const centerId = this.global.getControlValue(this.form, 'workCenter').id;
    const startDate = this.global.getControlValue(this.form, 'startDate');
    const endDate = this.global.getControlValue(this.form, 'endDate');
    const start = this.global.formatLocalDate(startDate);
    const end = this.global.formatLocalDate(endDate);
    const dateParams = `start=${start}&end=${end}`;
    const userCenterParam = `userId=${userId}&companyId=${centerId}`;
    const format = this.export.value.name;

    const route = `${API_URL}${EXPORT_REGISTER}?${userCenterParam}&${dateParams}&format=%22${format}%22`;
    this.global.export(route, "Registros_de_consumo", format);
  }

  /**
   * Fetches registers by center ID and updates the data source.
   * Makes an HTTP request to get registers for a specified center ID,
   * formats the register dates, and updates the data source.
   * @param centerID - The ID of the center to fetch registers for.
   */
  getRegistersByCenterId(centerID: number, startDate: Date, endDate: Date): void {
    const start = this.global.formatLocalDate(startDate);
    const end = this.global.formatLocalDate(endDate);
    this.global.httpCenter.getRegister(centerID, start, end).subscribe(totalRegister => {
      this.reloadTableData(totalRegister);
    })
  }

  /**
   * This function is used to filter the start date.
   * It checks if the selected date is before the current date.
   * @param d The selected date.
   * @returns A boolean value indicating if the date is valid.
   */
  filterStartDate = (d: Date | null): boolean => {
    const today = new Date();
    const Tday = today.getDate();
    const Tmonth = today.getMonth();
    const Tyear = today.getFullYear();

    const day = d?.getDate();
    const month = d?.getMonth();
    const year = d?.getFullYear();

    if (year !== undefined && month !== undefined && day !== undefined &&
      (year < Tyear || (year === Tyear && (month < Tmonth) || (year === Tyear && month === Tmonth && day < Tday))))
      return true;

    return false
  };

  /**
   * This function is used to filter the end date.
   * It checks if the selected date is after the received date and before the current date.
   * @param d The selected date.
   * @returns A boolean value indicating if the date is valid.
   */
  filterEndDate = (d: Date | null): boolean => {
    if (!this.global.getControlValue(this.form, 'startDate') || !d)
      return false;

    let dateSelected = this.global.getControlValue(this.form, 'startDate');
    const DSday = dateSelected.getDate();
    const DSmonth = dateSelected.getMonth();
    const DSyear = dateSelected.getFullYear();

    const today = new Date();
    const Tday = today.getDate();
    const Tmonth = today.getMonth();
    const Tyear = today.getFullYear();

    const day = d?.getDate();
    const month = d?.getMonth();
    const year = d?.getFullYear();

    if (year !== undefined && month !== undefined && day !== undefined &&
      (year > DSyear || (year === DSyear && (month > DSmonth) || (year === DSyear && month === DSmonth && day >= DSday))) &&
      (year < Tyear || (year === Tyear && (month < Tmonth) || (year === Tyear && month === Tmonth && day < Tday))))
      return true;

    return false
  };

  /**
   * Handles the click event on the table toggle button.
   * Toggles the visibility of the table based on the current state.
   */
  onConsultClick() {
    if (!this.showTable) {
      this.noResults = false;
      const id = this.global.getControlValue(this.form, 'workCenter').id;
      const startDate = this.global.getControlValue(this.form, 'startDate');
      const endDate = this.global.getControlValue(this.form, 'endDate');
      if (id && startDate && endDate) {
        this.getRegistersByCenterId(id, startDate, endDate);
        this.showTable = true;
      } else {
        this.global.openDialog('Por favor, selecciona un Centro de Trabajo, fecha de inicio y de fin válidos.');
      }
    }
  }

  /**
   * Opens the modal to add a new register.
   * Sets the data in the data service with a null item, the current work center, and a loading state of false.
   * Then, it shows the modal with the ID 'exampleModal'.
   */
  add(): void {
    this.dataService.setData([null, this.global.getControlValue(this.form, 'workCenter'), true, false]);
    const modal = new bootstrap.Modal(document.getElementById('exampleModal') as HTMLElement);
    modal.show();
  }

  /**
   * Opens a confirmation dialog to delete a register.
   * If the user confirms, it shows a dialog indicating that the item has been deleted.
   */
  delete(item: any): void {
    this.global.openDialog('¿Estás seguro de que deseas continuar?', true).subscribe(
      result => { if (result) {
        this.httpRegister.deleteRegister(item.id).subscribe({
          next: (response) => {
            console.log('Deleted successfully:', response);
            this.dataService.notifyDataUpdated();
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
   * Opens the modal to edit an existing register.
   * Sets the data in the data service with the provided item, the current work center, and a loading state of false.
   * Then, it shows the modal with the ID 'exampleModal'.
   *
   * @param item - The item to be edited.
   */
  edit(item: any): void {
    this.dataService.setData([item, this.global.getControlValue(this.form, 'workCenter'), false, false]);
    const modal = new bootstrap.Modal(document.getElementById('exampleModal') as HTMLElement);
    modal.show();
  }

  /**
   * Reloads the table data with the provided list of registers.
   * This function updates the data source of the table with the new list of registers.
   * @param totalRegister The list of registers to be used to reload the table data.
   */
  reloadTableData(totalRegister: TotalConsumptionData): void {
    this.dataSource.data = totalRegister.registers.map(register => ({
      id: register.id,
      date: register.date,
      registerDate: register.date.substring(0, 10),
      consumption: register.consumption.toFixed(2),
      cost: register.cost.toFixed(2)
    }));

    this.footerTable = [
      'Total',
      totalRegister.totalConsumption.toFixed(2),
      totalRegister.totalCost.toFixed(2)
    ];

    this.noResults = this.dataSource.data.length == 0;
  }
}
