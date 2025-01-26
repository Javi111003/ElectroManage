import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { GlobalModule } from '../../../../global/global.module'
import { DataService } from '../../../../../services/data/data.service';
import { Office } from '../../../../../models/office.interface';
import { OfficeService } from '../../../../../services/office/office.service';
import { Subscription } from 'rxjs';
import { Item } from '../../../../../shared/shared.module';
import { SnackbarService } from '../../../../../services/snackbar/snackbar.service';

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
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    public global: GlobalModule,
    private dataService: DataService,
    private officeService: OfficeService,
    private snackbar: SnackbarService
  ) {
    this.form = this.fb.group({
      officeName: ['', Validators.required],
      description: '',
      workCenter: ['', Validators.required]
    });
    this.dataService.setData(null);

    if (!this.global.getUserInfo().roles.includes('Admin')) {
      const name = this.global.getUserInfo().company.name;
      const id = this.global.getUserInfo().company.id;
      const workCenter: Item = {
        id: id,
        name: name
      };
      this.global.getControl(this.form, 'workCenter').setValue(workCenter);
    }
  }

  ngOnInit() {
    this.global.Reset();
    this.global.getWorkCenters();
    const sub = this.dataService.currentData.subscribe(newData => {
      if (newData) {
        this.data = newData[0];
        const center = newData[1];
        this.postMethod = newData[2];
        this.loading = newData[3];

        if (this.data)
          this.form.patchValue(this.data);

        if (center)
          this.global.getControl(this.form, 'workCenter').setValue(center);
      }
    });

    this.subscriptions.add(sub);
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
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
    this.loading = true;

    if (this.form.invalid) {
      this.loading = false;
      this.global.openDialog('Por favor, rellene todos los campos.');
      this.markAllAsTouched();
      return;
    }

    if (this.global.getControlValue(this.form, 'workCenter').id) {
      this.global.openDialog('¿Está seguro de que desea guardar los cambios?', true).subscribe(
      result => {
        if (result) {
          if (this.postMethod)
            this.createOffice();
          else {
            this.editOffice();
            this.postMethod = true;
          }
        } else {
          this.loading = false;
        }
      });
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
    const id = this.global.getControlValue(this.form, 'workCenter').id;
    const name = this.global.getControlValue(this.form, 'officeName');
    const description = this.global.getControlValue(this.form, 'description');
    const office = {
      companyId: id,
      name: name,
      description: description
    };

    return office;
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
    let id = 0;
    if (this.data)
      id = this.data.id;
    const serviceCall = action === 'create'
      ? this.officeService.postOffice(office)
      : this.officeService.editOffice(office, id);

    serviceCall.subscribe({
      next: (response) => {
        console.log(`${action.charAt(0).toUpperCase() + action.slice(1)}d successfully:`, response);
        const mssg = action === 'create' ? 'Añadido exitosamente...' : 'Editado exitosamente...';
        this.snackbar.openSnackBar(mssg);
        this.dataService.notifyDataUpdated();
        this.activateCloseButton();
      },
      error: (error) => {
        this.loading = false;
        console.log(error);
        const mssg = action === 'create' ? 'añadir' : 'editar';
        this.snackbar.openSnackBar(`Error al ${mssg}, intente de nuevo...`);
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

  /**
   * This function is used to activate the close button of the modal.
   * It retrieves the close button element and simulates a click event on it,
   * effectively closing the modal.
   */
  activateCloseButton(): void {
    const closeButton = document.getElementById('close-button') as HTMLButtonElement;
    closeButton.click();
  }
}

