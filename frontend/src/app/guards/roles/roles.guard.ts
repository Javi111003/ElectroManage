import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../services/auth/auth.service';

// Guard to protect routes based on user roles
export const rolesGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const expectedRoles = route.data?.['roles'] as Array<string>;

  if (authService.isLoggedIn() && authService.getUserRoles().find(
      role => expectedRoles.includes(role)
    )) {
    return true;
  } else {
    router.navigate(['/']);
    return false;
  }
};

