import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalModule } from '../../../../global/global.module';
import { DataService } from '../../../../../services/data/data.service';
import { RegisterUser } from '../../../../../models/credential.interface';
import { UserService } from '../../../../../services/user/user.service';
import { Subscription } from 'rxjs';
import { Item } from '../../../../../shared/shared.module';
import { SnackbarService } from '../../../../../services/snackbar/snackbar.service';

@Component({
  selector: 'app-user-manage-form',
  templateUrl: './manage-form.component.html',
  styleUrl: './manage-form.component.css'
})
export class ManageFormComponent implements OnInit, OnDestroy {
  constructor(
    private fb: FormBuilder,
    public global: GlobalModule,
    private dataService: DataService,
    private user: UserService,
    private snackbar: SnackbarService
  )
  {
    this.form = this.fb.group({
      userName: ['', Validators.required],
      email: ['', Validators.required],
      password: ['', Validators.required],
      role: [[], Validators.required],
      workCenter: ['', Validators.required]
    });

    this.dataService.setData(null);
  }

  private subscriptions: Subscription = new Subscription();
  loading: boolean = false;
  data: any;
  form: FormGroup;
  TextRoles: Item[] = [
    { id: 1, name: 'Administrador' },
    { id: 2, name: 'Gerente' },
    { id: 3, name: 'Analista' }
  ];
  roles: Map<string, string> = new Map<string, string>([
    ['Administrador', 'Admin'],
    ['Gerente', 'Manager'],
    ['Analista', 'Analist']
  ]);

  ngOnInit(): void {
    const sub = this.dataService.currentData.subscribe(newData => {
      if (newData) {
        this.data = newData[0];
        if (this.data)
          this.data.role = this.data.role.map((role: string) => {
            return this.TextRoles.find(item => item.name === role)
          });

        this.form.patchValue(this.data);
        this.loading = newData[1];
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
    this.loading = true;
    if (this.form.invalid) {
      this.global.openDialog('Por favor, rellene todos los campos.');
      this.markAllAsTouched();
      return;
    }

    if (this.getControlValue('workCenter').id) {
      this.global.openDialog('¿Está seguro de que desea guardar los cambios?', true).subscribe(
      result => {
        console.log(result);
        if (result) {
          this.register();
          console.log('confirm');
        }
      });
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
    const rolesSelected: Item[] = this.getControlValue('role');
    let rolesToPost: string[] = [];

    for (let i = 0; i < rolesSelected.length; i++) {
      rolesToPost.push(this.roles.get(rolesSelected[i].name)!);
    }

    const registerData: RegisterUser = {
      email: this.getControlValue('email'),
      username: this.getControlValue('userName'),
      password: this.getControlValue('password'),
      roles: rolesToPost,
      companyId: this.getControlValue('workCenter').id
    };

    this.user.registerUser(registerData).subscribe({
      next: (response) => {
        console.log('User registered successfully:', response);
        this.snackbar.openSnackBar('Añadido exitosamente...');
        this.dataService.notifyDataUpdated();
        this.activateCloseButton();
      },
      error: (error) => {
        this.loading = false;
        console.log(error);
        this.snackbar.openSnackBar('Error al añadir, intente de nuevo...')
      }
    });
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
