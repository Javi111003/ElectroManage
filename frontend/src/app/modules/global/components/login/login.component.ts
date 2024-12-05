import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';
import { GlobalModule } from '../../global.module';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  username = 'user';
  password = 'password';

  constructor(
    private authService: AuthService,
    private router: Router,
    public global: GlobalModule
  ) {}

  /**
   * Attempts to log in the user with the provided credentials.
   * If the credentials are valid, navigates to the root route.
   * Otherwise, displays an alert with an error message.
   */
  login() {
    if (this.authService.login(this.username, this.password)) {
      this.router.navigate(['']);
    } else {
      this.global.openDialog('Credenciales inválidas');
    }
  }
}
