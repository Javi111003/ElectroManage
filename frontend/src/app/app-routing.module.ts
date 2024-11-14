import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuComponent } from './modules/global/components/menu/menu.component';

const routes: Routes = [
  {
    path: '',
    component: MenuComponent,
    loadChildren: () => import('./routes.module').then(m => m.AppRouterModule)
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
