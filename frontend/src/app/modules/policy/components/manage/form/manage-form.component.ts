import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { GlobalModule } from '../../../../global/global.module'
import { DataService } from '../../../../../services/data/data.service';
import { PolicyService } from '../../../../../services/policy/policy.service';
import { Policy } from '../../../../../models/policy.interface';
import { Subscription } from 'rxjs';
import { SnackbarService } from '../../../../../services/snackbar/snackbar.service';

@Component({
  selector: 'app-policy-manage-form',
  templateUrl: './manage-form.component.html',
  styleUrl: './manage-form.component.css'
})
export class ManageFormComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  form: FormGroup;
  data: any;
  postMethod: boolean = true;
  loading: boolean = false;

  constructor(
    private fb: FormBuilder,
    public global: GlobalModule,
    private dataService: DataService,
    private policyService: PolicyService,
    private snackbar: SnackbarService
  ) {
    this.form = this.fb.group({
      policyName: ['', Validators.required],
      description: ['', Validators.required],
    });
    this.dataService.setData(null);
  }

  ngOnInit(): void {
    if (this.dataService && this.dataService.currentData) {
      const sub = this.dataService.currentData.subscribe({
        next: (newData) => {
          if (newData) {
            this.data = newData[0];
            this.postMethod = newData[1];
            this.loading = newData[2];
            this.form.patchValue(this.data);
          }
        },
        error: (error) => {
          console.error('Error en la suscripción:', error);
        }
      });
      this.subscriptions.add(sub);
    }
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
      this.global.openDialog('Por favor rellene todos los campos requeridos.');
      this.markAllAsTouched();
      return;
    }

    this.global.openDialog('Seguro que quieres guardar los cambios ?', true).subscribe(
    result =>{
      if (result) {
        if(this.postMethod)
          this.createPolicy();
        else {
          this.editPolicy();
        }
      } else {
        this.loading = false;
      }
    });
  }

  /**
   * Prepares the form for submission by marking all controls as touched.
   * This method is used to ensure all form controls are marked as touched,
   * which can be useful for form validation and error handling.
   */
  markAllAsTouched(): void {
    Object.keys(this.form.controls).forEach(field => {
      const control = this.global.getControl(this.form, field);
      control?.markAsTouched();
    });
  }

  /**
   * Creates or edits a policy based on the form data.
   * This method retrieves the necessary data from the form,
   * and then attempts to save the policy data to the server. If successful, it logs the response.
   * If the operation fails, it displays an error message to the user.
   * @param isEdit - Whether the operation is an edit (true) or create (false)
   */
  handlePolicy(isEdit: boolean): void {
    const name = this.global.getControlValue(this.form, 'policyName');
    const description = this.global.getControlValue(this.form, 'description');
    const policy: Policy = { name, description };

    let request$;
    if (isEdit) {
      request$ = this.policyService.editPolicy(policy, this.data.id);
    } else {
      request$ = this.policyService.postPolicy(policy);
    }

    request$.subscribe({
      next: (response) => {
        console.log('Operación exitosa:', response);
        const mssg = isEdit ? 'Editado exitosamente...' : 'Añadido exitosamente...';
        this.snackbar.openSnackBar(mssg);
        this.dataService.notifyDataUpdated();
        this.activateCloseButton();
      },
      error: (error) => {
        this.loading = false;
        console.log(error);
        const mssg = isEdit ? 'editar' : 'añadir';
        this.snackbar.openSnackBar(`Error al ${mssg}, intente de nuevo...`);
      }
    });
  }

  /**
   * Initiates the creation of a new policy.
   * This method calls the `handlePolicy` function with `false` as the argument,
   * indicating that a new policy should be created.
   */
  createPolicy(): void {
    this.handlePolicy(false);
  }

  /**
   * This function is used to edit an existing policy.
   * It retrieves the necessary information from the form controls to update a policy.
   * It then calls the `handlePolicy` function to handle the editing process.
   */
  editPolicy(): void {
    this.handlePolicy(true);
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
