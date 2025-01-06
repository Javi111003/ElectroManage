import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalModule } from '../../../../global/global.module';
import { DataService } from '../../../../../services/data/data.service';
import { RegisterUser } from '../../../../../models/credential.interface';
import { UserService } from '../../../../../services/user/user.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-user-manage-form',
  templateUrl: './manage-form.component.html',
  styleUrl: './manage-form.component.css'
})
export class ManageFormComponent implements OnInit, OnDestroy {
  private subscriptions: Subscription = new Subscription();

  constructor(
    private fb: FormBuilder,
    public global: GlobalModule,
    private dataService: DataService,
    private user: UserService
  )
  {
    this.form = this.fb.group({
      name: ['', Validators.required],
      password: ['', Validators.required],
      role: [[], Validators.required],
      workCenter: ['', Validators.required]
    });

    this.dataService.setData(null);
  }

  data: any;
  form: FormGroup;
  TextRoles: string[] = [
    'Administrador', 'Gerente', 'Analista'
  ];
  roles: Map<string, string> = new Map<string, string>([
    ['Administrador', 'Admin'],
    ['Gerente', 'Manager'],
    ['Analista', 'Analist']
  ]);

  ngOnInit(): void {
    const sub = this.dataService.currentData.subscribe(newData => {
      this.data = newData;
      this.form.patchValue(this.data);
    });

    this.subscriptions.add(sub);
    this.global.Reset();
    this.global.getWorkCenters();
  }

  ngOnDestroy(): void {
    this.subscriptions.unsubscribe();
  }

  /**
   * Initializes the component by setting up the form and subscribing to data changes.
   */
  getControl(control: string): FormControl {
    return this.form.get(control) as FormControl;
  }

  /**
   * Retrieves the FormControl object for a given control name from the form.
   * This method is used to access and manipulate form controls dynamically.
   * @param control The name of the control to retrieve.
   * @returns The FormControl object associated with the specified control name.
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
      this.global.openDialog('Por favor, rellene todos los campos.');
      this.markAllAsTouched();
      return;
    }

    const center = this.getControlValue('workCenter');
    if (this.global.isOptionValid(this.global.centerStringArray, center)) {
      const confirmation = confirm('¿Está seguro de que desea guardar los cambios?');
      if (confirmation) {
        this.register();
      }
    } else {
      this.global.openDialog('Por favor, selecciona un Centro de Trabajo válido.');
    }
  }

  /**
   * Prepares the form for submission by marking all controls as touched.
   * This method is used to ensure all form controls are marked as touched,
   * which can be useful for form validation and error handling.
   */
  markAllAsTouched(): void {
    Object.keys(this.form.controls).forEach(field => {
      const control = this.getControl(field);
      control?.markAsTouched();
    });
  }

  /**
   * Registers a new user based on the form data.
   * This method retrieves the necessary data from the form, validates the work center selection,
   * and then attempts to save the user data to the server. If successful, it reloads the page.
   * If the operation fails, it displays an error message to the user.
   */
  register(): void {
    const rolesSelected: string[] = this.getControlValue('role');
    console.log(rolesSelected);
    const centerSelected: string = this.getControlValue('workCenter');
    console.log(centerSelected);
    this.global.findCenterId(centerSelected);

    let rolesToPost: string[] = [];

    for (let i = 0; i < rolesSelected.length; i++) {
      rolesToPost.push(this.roles.get(rolesSelected[i])!);
    }

    const registerData: RegisterUser = {
      email: this.getControlValue('name'),
      password: this.getControlValue('password'),
      roles: rolesToPost,
      companyId: this.global.centerSelectedId
    };

    this.user.registerUser(registerData).subscribe({
      next: (response) => {
        console.log('User registered successfully:', response);
        this.dataService.notifyDataUpdated();
      },
      error: (error) => {
        console.log(error);
      }
    });
  }
}
