import { Routes } from "@angular/router";
import { ManageComponent } from "./components/manage/index/manage.component";
import { ManageFormComponent } from "./components/manage/form/manage-form.component";


export const userRoutes: Routes = [
  {
    path:'user/manage/index',
    component: ManageComponent,
    loadChildren: () => import('./user.module').then(m => m.UserModule)
  },
  {
    path:'user/manage/form',
    component: ManageFormComponent,
    loadChildren: () => import('./user.module').then(m => m.UserModule)
  }
];
