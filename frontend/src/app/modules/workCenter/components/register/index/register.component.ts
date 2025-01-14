import { Component, OnInit } from '@angular/core';
import { ConfigColumn } from '../../../../../shared/components/table/table.component';
import { MatTableDataSource } from '@angular/material/table';
import { GlobalModule } from '../../../../global/global.module'
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import { DataService } from '../../../../../services/data/data.service';
import { Item } from '../../../../../shared/shared.module';

declare var bootstrap: any;

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrl: './register.component.css'
})
export class RegisterComponent implements OnInit {
  constructor (
    public global: GlobalModule,
    private fb: FormBuilder,
    private dataService: DataService
  ) {
    this.form = this.fb.group({
      startDate: [null],
      endDate: [null],
      workCenter: ''
    });

    if (!this.global.getUserInfo().roles.includes('Admin')) {
      const name = this.global.getUserInfo().info.company.name;
      const id = this.global.getUserInfo().info.company.id;
      const workCenter: Item = {
        id: id,
        name: name
      };
      this.getControl('workCenter').setValue(workCenter);
    }

    this.form.valueChanges.subscribe(() => {
      this.showTable = false;
      this.dataSource.data = [];
    });
  }

  form: FormGroup;
  showTable: boolean = false;
  dataSource: MatTableDataSource<any> = new MatTableDataSource([0]);
  consumptions: number[] = [];
  costs: number[] = [];
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

  ngOnInit(): void {
    this.global.Reset();
    this.global.getWorkCenters();
    this.form.get('startDate')?.valueChanges.subscribe(() => {
      this.getControl('endDate').reset();
    });
  }

  /**
   * Retrieves a form control by its name.
   *
   * @param control - The name of the control to retrieve.
   * @returns The FormControl associated with the given name.
   */
  getControl(control: string): FormControl {
    return this.form.get(control) as FormControl;
  }

  /**
   * Retrieves the value of a form control by its name.
   *
   * @param control - The name of the control whose value is to be retrieved.
   * @returns The value of the specified form control.
   */
  getControlValue(control: string): any {
    return this.form.get(control)?.value;
  }

  /**
   * Fetches registers by center ID and updates the data source.
   * Makes an HTTP request to get registers for a specified center ID,
   * formats the register dates, and updates the data source.
   * @param centerID - The ID of the center to fetch registers for.
   */
  getRegistersByCenterId(centerID: number): void {
    this.global.httpCenter.getRegister().subscribe(register => {
      const registers = register.registers

      for (let index = 0; index < register.registers.length; index++) {
        registers[index].registerDate = registers[index].registerDate.substring(0, 10);
      }

      this.dataSource.data = register.registers;
      this.consumptions = this.dataSource.data.map(item => item.consumption);
      this.costs = this.dataSource.data.map(item => item.cost);
      this.footerTable = [
        'Total',
        this.getTotalConsumption().toFixed(2).toString(),
        this.getTotalCost().toFixed(2).toString()
      ];
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
      (year < Tyear || (year === Tyear && (month < Tmonth) || (month === Tmonth && day < Tday))))
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
    if (!this.getControlValue('startDate') || !d)
      return false;

    let dateSelected = this.getControlValue('startDate');
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
      (year > DSyear || (year === DSyear && (month > DSmonth) || (month === DSmonth && day >= DSday))) &&
      (year < Tyear || (year === Tyear && (month < Tmonth) || (month === Tmonth && day < Tday))))
      return true;

    return false
  };

  /**
   * Handles the click event on the table toggle button.
   * Toggles the visibility of the table based on the current state.
   */
  onConsultClick() {
    if (!this.showTable) {
      if (this.getControlValue('workCenter').id &&
      this.getControlValue('startDate') && this.getControlValue('endDate')) {
        this.getRegistersByCenterId(0);
        this.showTable = true;
      } else {
        this.global.openDialog('Por favor, selecciona un Centro de Trabajo, fecha de inicio y de fin válidos.');
      }
    }
  }

  /**
  * Calculates the total cost.
  * This function uses the reduce method to sum up all the values
  * in the `costs` array and returns the total.
  * @returns The total cost.
  */
  getTotalCost(): number {
    return this.costs.reduce((acc, value) => acc + value, 0);
  }

  /**
  * Calculates the total consumption.
  * This function uses the reduce method to sum up all the values
  * in the `consumptions` array and returns the total.
  * @returns The total consumption.
  */
  getTotalConsumption(): number {
    return this.consumptions.reduce((acc, value) => acc + value, 0);
  }

  /**
   * Opens the modal to add a new register.
   * Sets the data in the data service with a null item, the current work center, and a loading state of false.
   * Then, it shows the modal with the ID 'exampleModal'.
   */
  add(): void {
    this.dataService.setData([null, this.getControlValue('workCenter'), false]);
    const modal = new bootstrap.Modal(document.getElementById('exampleModal') as HTMLElement);
    modal.show();
  }

  /**
   * Opens a confirmation dialog to delete a register.
   * If the user confirms, it shows a dialog indicating that the item has been deleted.
   */
  delete(): void {
    this.global.openDialog('¿Estás seguro de que deseas continuar?', true).subscribe(
      result => { if (result) {
        this.global.openDialog('Eliminado');
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
    this.dataService.setData([item, this.getControlValue('workCenter'), false]);
    const modal = new bootstrap.Modal(document.getElementById('exampleModal') as HTMLElement);
    modal.show();
  }
}
