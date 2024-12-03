import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../../../services/auth/auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'] // Asegúrate de que esta ruta sea correcta
})
export class LoginComponent {
  username = 'user';
  password = 'password';

  constructor(private authService: AuthService, private router: Router) {}
  
  login() {
    if (this.authService.login(this.username, this.password)) {
      this.router.navigate(['']);
    } else {
      alert('Credenciales inválidas');
    }
  }
}
