import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { GlobalModule } from '../../../../global/global.module'
import { DataService } from '../../../../../services/data/data.service';
import { PolicyService } from '../../../../../services/policy/policy.service';
import { Policy } from '../../../../../models/policy.interface';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-policy-manage-form',
  templateUrl: './manage-form.component.html',
  styleUrl: './manage-form.component.css'
})
export class ManageFormComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();
  @Input() selectedItem: any = null;
  form: FormGroup;
  data: any;

  constructor(
    private fb: FormBuilder,
    public global: GlobalModule,
    private dataService: DataService,
    private policyService: PolicyService
  ) {
    this.form = this.fb.group({
      policyName: ['', Validators.required],
      description: ['', Validators.required],
    });
    this.dataService.setData(null);
  }

  ngOnInit(): void {
    const sub = this.dataService.currentData.subscribe(newData => {
      this.data = newData;
      this.form.patchValue(this.data);
    });
    this.subscriptions.add(sub);
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
      confirm('Please fill in all fields.');
      this.markAllAsTouched();
      return;
    }

    const confirmation = confirm('Are you sure you want to save the changes?');
    if (confirmation) {
      this.createPolicy();
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
   * Creates a new policy based on the form data.
   * This method retrieves the necessary data from the form,
   * and then attempts to save the policy data to the server. If successful, it logs the response.
   * If the operation fails, it displays an error message to the user.
   */
  createPolicy(): void {
    const name = this.getControlValue('policyName');
    const description = this.getControlValue('description');
    const policy: Policy = {
      name: name,
      description: description
    }

    this.policyService.postPolicy(policy).subscribe({
      next: (response) => {
        console.log('Created successfully:', response);
        // window.location.reload();
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
