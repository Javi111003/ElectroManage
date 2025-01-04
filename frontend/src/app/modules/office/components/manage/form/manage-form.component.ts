import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { GlobalModule } from '../../../../global/global.module'
import { DataService } from '../../../../../services/data/data.service';
import { Office } from '../../../../../models/office.interface';
import { OfficeService } from '../../../../../services/office/office.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-office-manage-form',
  templateUrl: './manage-form.component.html',
  styleUrls: ['./manage-form.component.css']
})
export class ManageFormComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  data: any;
  form: FormGroup;
  postMethod: boolean = true;

  constructor(
    private fb: FormBuilder,
    public global: GlobalModule,
    private dataService: DataService,
    private officeService: OfficeService
  ) {

    this.form = this.fb.group({
      officeName: ['', Validators.required],
      description: '',
      workCenter: ['', Validators.required]
    });
    this.dataService.setData(null);
  }

  ngOnInit() {
    const sub = this.dataService.currentData.subscribe(newData => {
      if (newData) {
        this.data = newData[0];
        const center = newData[1];
        const post = newData[2];

        if (this.data)
          this.form.patchValue(this.data);

        if (center)
          this.getControl('workCenter').setValue(center);

        this.postMethod = post;
      }
    });

    this.subscriptions.add(sub);
    this.global.Reset();
    this.global.getWorkCenters();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * Retrieves the FormControl object for a given control name from the form.
   * This method is used to access and manipulate form controls dynamically.
   * @param control The name of the control to retrieve.
   * @returns The FormControl object associated with the specified control name.
   */
  getControl(control: string): FormControl {
    return this.form.get(control) as FormControl;
  }

  /**
   * Retrieves the value of a given control from the form.
   * This method is used to access the current value of a form control.
   * @param control The name of the control to retrieve the value from.
   * @returns The current value of the specified control.
   */
  getControlValue(control: string): any {
    return this.form.get(control)?.value;
  }

  /**
   * Closes the modal window and resets the form.
   * This method is used to clear the form data and close the modal window.
   */
  onCloseModal(): void {
    this.form.reset();
  }

  /**
   * Submits the form data for processing.
   * This method checks the form validity before attempting to submit the data.
   * If the form is invalid, it prompts the user to fill in all fields.
   * If the form is valid, it confirms with the user before proceeding to save the changes.
   */
  onSubmit(): void {
    if (this.form.invalid) {
      confirm('Por favor, rellene todos los campos.');
      this.markAllAsTouched();
      return;
    }

    const center = this.getControlValue('workCenter');
    if (this.global.isOptionValid(this.global.centerStringArray, center)) {
      const confirmation = confirm('¿Está seguro de que desea guardar los cambios?');
      if (confirmation) {

        if (this.postMethod)
          this.createOffice();
        else {
          this.editOffice();
          this.postMethod = true;
        }
      }
    } else {
      this.global.openDialog("Por favor, selecciona un Centro de Trabajo válido.");
    }
  }

  /**
   * Prepares the form for submission by marking all controls as touched.
   * This method is used to ensure all form controls are marked as touched,
   * which can be useful for form validation and error handling.
   */

  markAllAsTouched(): void {
    Object.keys(this.form.controls).forEach(field => {
      const control = this.form.get(field);
      control?.markAsTouched();
    });
  }

  /**
   * Creates a new office based on the form data.
   * This method retrieves the necessary data from the form, validates the work center selection,
   * and then attempts to save the office data to the server. If successful, it reloads the page.
   * If the operation fails, it displays an error message to the user.
   */
  createOffice(): void {
    const office = this.getOfficeObject();
    this.handleOffice(office, 'create');
  }

  /**
   * This function is used to create a new office instance.
   * It retrieves the necessary information from the form controls and creates a new office instance.
   * The office instance is then posted to the server for creation.
   */
  getOfficeObject(): Office {
    const name = this.getControlValue('officeName');
    const description = this.getControlValue('description');

    return {
      companyId: this.global.centerSelectedId,
      name: name,
      description: description
    };
  }

  /**
   * This function is used to handle the creation or editing of an office.
   * It determines whether to create or edit based on the `action` parameter.
   * It calls the appropriate service method (either `postOffice` or `editOffice`)
   * with the provided `office` and handles the response or error accordingly.
   * If successful, it reloads the page and notifies the data service to update the data.
   * @param office The office instance to be created or edited.
   * @param action A string indicating whether to create or edit an office.
   */
  handleOffice(office: Office, action: 'create' | 'edit'): void {
    const serviceCall = action === 'create'
      ? this.officeService.postOffice(office)
      : this.officeService.editOffice(office, this.global.officeSelectedId);

    serviceCall.subscribe({
      next: (response) => {
        console.log(`${action.charAt(0).toUpperCase() + action.slice(1)}d successfully:`, response);
        this.dataService.notifyDataUpdated();
      },
      error: (error) => {
        if (error.statusText === 'Unknown Error') {
          this.global.openDialog("Falló la conexión. Intente de nuevo");
        } else if (error.error) {
          this.global.openDialog(error.error.errors[0].reason);
        } else {
          this.global.openDialog('No se ha podido guardar correctamente. Error inesperado');
        }
      }
    });
  }

  /**
   * Edits an existing office instance.
   * This function retrieves the necessary information from the form controls to update an office instance.
   * It then calls the `handleOffice` function to handle the editing process.
   */
  editOffice(): void {
    const office = this.getOfficeObject();
    this.handleOffice(office, 'edit');
  }
}

