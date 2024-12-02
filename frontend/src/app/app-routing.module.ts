import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './modules/global/components/login/login.component';
import { MenuComponent } from './modules/global/components/menu/menu.component';
import { authGuard } from './guards/auth/auth.guard';

const routes: Routes = [
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: '',
    component: MenuComponent,
    canActivate: [authGuard],
    loadChildren: () => import('./routes.module').then(m => m.AppRouterModule)
  },
  {
    path: '**',
    redirectTo: 'login'
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
