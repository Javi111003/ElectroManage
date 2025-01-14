import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalModule } from '../../../../global/global.module';
import { DataService } from '../../../../../services/data/data.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-register-form',
  templateUrl: './register-form.component.html',
  styleUrl: './register-form.component.css'
})
export class RegisterFormComponent implements OnInit, OnDestroy {
  constructor(
    private fb: FormBuilder,
    public global: GlobalModule,
    private dataService: DataService
  )
  {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    this.form = this.fb.group({
      workCenter: ['', Validators.required],
      date: [yesterday, Validators.required],
      consumption: [null, Validators.required],
    });

    this.dataService.setData(null);
    if (!this.global.getUserInfo().roles.includes('Admin')) {
      const workcenter = this.global.getUserInfo().info.company.name;
      this.getControl('workCenter').setValue(workcenter);
    }
  }

  @Input() data: any;
  private subscriptions: Subscription = new Subscription();
  loading: boolean = false;
  form: FormGroup;

  ngOnInit() {
    const sub = this.dataService.currentData.subscribe(newData => {
      if (newData) {
        if (newData[0]) {
          this.data = newData[0];
          this.form.patchValue(this.data);
          const dateString = this.data.registerDate;
          const dateParts = dateString.split('-');
          const year = parseInt(dateParts[0], 10);
          const month = parseInt(dateParts[1], 10) - 1;
          const day = parseInt(dateParts[2], 10);
          this.getControl('date').setValue(new Date(year, month, day));
        }
        if (newData[1])
          this.getControl('workCenter').setValue(newData[1]);

        this.loading = newData[2];
      }
    });

    this.subscriptions.add(sub);
  }

  ngOnDestroy() {
    this.subscriptions.unsubscribe();
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
   * Resets the form and sets default values for certain fields.
   *
   * This function resets the form to its initial state and sets the 'date' field
   * to yesterday's date. If the user is not an admin, it also sets the 'workCenter'
   * field to the user's company name.
   */
  onCloseModal(): void {
    this.form.reset();
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    this.getControl('date').setValue(yesterday);
    if (!this.global.getUserInfo().roles.includes('Admin')) {
      const workcenter = this.global.getUserInfo().info.company.name;
      this.getControl('workCenter').setValue(workcenter);
    }
  }

  /**
   * Handles the form submission process.
   *
   * This function checks if the form is valid before proceeding. If the form is invalid,
   * it alerts the user to fill in all fields and marks all controls as touched. If the form
   * is valid, it asks for confirmation to save changes and reloads the page upon confirmation.
   */
  onSubmit(): void {
    this.loading = true;
    if (this.form.invalid) {
      this.global.openDialog('Por favor, rellene todos los campos.');
      this.markAllAsTouched();
      return;
    }

    this.global.openDialog('¿Está seguro de que desea guardar los cambios?').subscribe(
    result => {
      if (result) {
        window.location.reload();
      }
    });
  }

  /**
   * Marks all form controls as touched.
   *
   * This function iterates over all form controls and marks each one as touched,
   * which is useful for triggering validation messages.
   */
  markAllAsTouched(): void {
    Object.keys(this.form.controls).forEach(field => {
      const control = this.getControl(field);
      control?.markAsTouched();
    });
  }

  /**
   * Filters dates to allow only past dates.
   *
   * @param d - The date to be checked.
   * @returns True if the date is in the past, false otherwise.
   */
  filterDate = (d: Date | null): boolean => {
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

    return false;
  }
}
