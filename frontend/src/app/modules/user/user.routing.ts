import { Routes } from "@angular/router";
import { ManageComponent } from "./components/manage/index/manage.component";
import { ManageFormComponent } from "./components/manage/form/manage-form.component";
import { rolesGuard } from "../../guards/roles/roles.guard";


export const userRoutes: Routes = [
  {
    path:'user/manage/index',
    component: ManageComponent,
    canActivate: [rolesGuard],
    data: {
      roles: ['Admin']
    },
    loadChildren: () => import('./user.module').then(m => m.UserModule)
  },
  {
    path:'user/manage/form',
    component: ManageFormComponent,
    canActivate: [rolesGuard],
    data: {
      roles: ['Admin']
    },
    loadChildren: () => import('./user.module').then(m => m.UserModule)
  }
];
