import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { GlobalModule } from '../../../../global/global.module';
import { DataService } from '../../../../../services/data/data.service';
import { EditedUser, RegisterUser } from '../../../../../models/credential.interface';
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
  postMethod: boolean = true;

  constructor(
    private fb: FormBuilder,
    public global: GlobalModule,
    private dataService: DataService,
    private httpUser: UserService,
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

  ngOnInit(): void {
    const sub = this.dataService.currentData.subscribe(newData => {
      if (newData) {
        this.data = newData[0];
        this.form.patchValue(this.data);
        if (this.data) {
          console.log(this.data.role);
          const roles = this.data.role.map((role: string) => {
            return this.TextRoles.find(item => item.name === role)
          });

          this.global.getControl(this.form, 'role').setValue(roles);
        }

        this.postMethod = newData[1];
        this.loading = newData[2];
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
    if (this.checkForm()) {
      this.loading = false;
      this.global.openDialog('Por favor, rellene todos los campos.');
      this.markAllAsTouched();
      return;
    }

    if (this.global.getControlValue(this.form, 'workCenter').id) {
      this.global.openDialog('¿Está seguro de que desea guardar los cambios?', true).subscribe(
      result => {
        console.log(result);
        if (result) {
          if (this.postMethod)
            this.register();
          else
            this.editUser();
        } else {
          this.loading = false;
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
      const control = this.global.getControl(this.form, field);
      control?.markAsTouched();
    });
  }

  /**
   * Checks the form validity and sets a default password if the form is in edit mode.
   * This method sets a default password if the form is in edit mode (postMethod is false),
   * and then checks if the form is invalid.
   * @returns A boolean indicating whether the form is invalid.
   */
  checkForm(): boolean {
    if (!this.postMethod)
      this.global.getControl(this.form, 'password').setValue("String123.");

    return this.form.invalid;
  }

  /**
   * Retrieves the roles to be posted.
   * This method extracts the selected roles from the form control and maps them to their corresponding role names.
   * @returns An array of role names to be posted.
   */
  private getRolesToPost(): string[] {
    const rolesSelected: Item[] = this.global.getControlValue(this.form, 'role');
    return rolesSelected.map(role => this.roles.get(role.name)!);
  }

  /**
   * Handles the response from a successful HTTP request.
   * This method logs the success message and response, displays a success snackbar message,
   * notifies that data has been updated, and activates the close button of the modal.
   * @param response The response object from the HTTP request.
   * @param successMessage The message to log upon success.
   * @param errorMessage The message to display in case of an error.
   */
  private handleResponse(response: any, successMessage: string, errorMessage: string) {
    console.log(successMessage, response);
    this.snackbar.openSnackBar(errorMessage);
    this.dataService.notifyDataUpdated();
    this.activateCloseButton();
  }

  /**
   * Handles errors from an HTTP request.
   * This method logs the error, sets the loading state to false, and displays an error snackbar message.
   * @param error The error object from the HTTP request.
   * @param errorMessage The message to display in case of an error.
   */
  private handleError(error: any, errorMessage: string) {
    this.loading = false;
    console.log(error);
    this.snackbar.openSnackBar(errorMessage);
  }

  /**
   * Registers a new user.
   * This method constructs a RegisterUser object using form control values and sends an HTTP POST request
   * to register the user. It handles the response and errors appropriately.
   */
  register(): void {
    const registerData: RegisterUser = {
      email: this.global.getControlValue(this.form, 'email'),
      username: this.global.getControlValue(this.form, 'userName'),
      password: this.global.getControlValue(this.form, 'password'),
      roles: this.getRolesToPost(),
      companyId: this.global.getControlValue(this.form, 'workCenter').id
    };

    this.httpUser.registerUser(registerData).subscribe({
      next: (response) => this.handleResponse(response, 'User registered successfully', 'Añadido exitosamente...'),
      error: (error) => this.handleError(error, 'Error al añadir, intente de nuevo...')
    });
  }

  /**
   * Edits an existing user.
   * This method constructs an EditedUser object using form control values and sends an HTTP PUT request
   * to update the user. It handles the response and errors appropriately.
   */
  editUser(): void {
    const userData: EditedUser = {
      username: this.global.getControlValue(this.form, 'userName'),
      roles: this.getRolesToPost(),
      companyId: this.global.getControlValue(this.form, 'workCenter').id
    };

    this.httpUser.editUser(userData, this.data.id).subscribe({
      next: (response) => this.handleResponse(response, 'User edited successfully', 'Editado exitosamente...'),
      error: (error) => this.handleError(error, 'Error al editar, intente de nuevo...')
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
