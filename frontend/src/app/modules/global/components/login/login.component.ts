import { AccessToken, UserLogged } from './../../../../models/credential.interface';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';
import { GlobalModule } from '../../global.module';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Credential } from '../../../../models/credential.interface';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  constructor(
    private authService: AuthService,
    private router: Router,
    public global: GlobalModule,
    private fb: FormBuilder
  )
  {
    this.form = fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  form: FormGroup;
  loading: boolean = false;

  /**
   * Initializes the login form with the required fields.
   * This method sets up the form with username and password fields,
   * each validated to be required.
   */
  getControl(control: string): FormControl {
    return this.form.get(control) as FormControl;
  }

  /**
   * Retrieves the FormControl object for a given control name from the login form.
   * This method is used to access and manipulate form controls dynamically.
   * @param control The name of the control to retrieve.
   * @returns The FormControl object associated with the specified control name.
   */
  getControlValue(control: string): any {
    return this.form.get(control)?.value;
  }

  /**
   * Attempts to log in the user with the provided credentials.
   * If the credentials are valid, navigates to the root route.
   * Otherwise, displays an alert with an error message.
   */
  login(): void {
    this.loading = true;
    const credentials: Credential = {
      email: this.getControlValue('username'),
      password: this.getControlValue('password')
    };
    this.authService.login(credentials).subscribe({
      next: (response) => {
        if (response && response.accessToken) {
          this.loading = false;
          const token: AccessToken = response.accessToken;
          const user: UserLogged = {
            id: response.id,
            username: "",
            email: response.email,
            company: response.company,
            roles: response.roles
          }
          // Guardar el tiempo de inicio de sesión
          const loginTime = new Date().getTime();
          sessionStorage.setItem('loginTime', loginTime.toString());
          sessionStorage.setItem('token', token.token);
          sessionStorage.setItem('expiration', token.expiration);
          sessionStorage.setItem('isAuthenticated', 'true');
          sessionStorage.setItem('userLogged', JSON.stringify(user));
          this.router.navigate(['/']);
        }
      },
      error: (error) => {
        console.log(error);
        this.loading = false;
      }
    });
  }
}
