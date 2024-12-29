import { AccessToken, UserInfo } from './../../../../models/credential.interface';
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
  form: FormGroup;
  loading: boolean = false;

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

  getControl(control: string): FormControl {
    return this.form.get(control) as FormControl;
  }

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
          const info: UserInfo = {
            id: response.id,
            email: response.email,
            company: response.company
          }

          sessionStorage.setItem('token', token.token);
          sessionStorage.setItem('expiration', token.expiration);
          sessionStorage.setItem('isAuthenticated', 'true');
          this.router.navigate(['/']);

          this.global.userInfo = {
            info: info,
            roles: response.roles
          }
        } else {
          this.global.openDialog("Credenciales Inválidas");
        }
      },
      error: () => {
        this.global.openDialog("Credenciales Inválidas");
        this.loading = false;
      }
    });
  }
}
