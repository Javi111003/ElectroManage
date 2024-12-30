import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { GlobalModule } from '../../../../global/global.module'
import { DataService } from '../../../../../services/data/data.service';
import { Office } from '../../../../../models/office.interface';
import { OfficeService } from '../../../../../services/office/office.service';

@Component({
  selector: 'app-office-manage-form',
  templateUrl: './manage-form.component.html',
  styleUrls: ['./manage-form.component.css']
})
export class ManageFormComponent implements OnInit {
  data: any;
  form: FormGroup;

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
    this.dataService.currentData.subscribe(newData => {
      this.data = newData;
      this.form.patchValue(this.data);
    });

    this.global.Reset();
    this.global.getWorkCenters();
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
        this.createOffice();
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
    const center = this.getControlValue('workCenter');
    this.global.findCenterId(center);

    const name = this.getControlValue('officeName');
    const description = this.getControlValue('description');

    const office: Office = {
      companyId: this.global.centerSelectedId,
      name: name,
      description: description
    }

    this.officeService.postOffice(office).subscribe({
      next: (response) => {
        console.log('Created successfully:', response);
        window.location.reload();
      },
      error: (error) => {
        if (error.statusText === 'Unknown Error')
          this.global.openDialog("Falló la conexión. Intente de nuevo");
        else if(error.error)
          this.global.openDialog(error.error.errors[0].reason);
        else
          this.global.openDialog('No se ha podido guardar correctamente. Error inesperado');
      }
    });
  }
}

