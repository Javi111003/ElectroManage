import { Routes } from "@angular/router";
import { ComparisonComponent } from "./components/comparison/index/comparison.component";
import { ManageComponent } from "./components/manage/index/manage.component";
import { ManageFormComponent } from "./components/manage/form/manage-form.component";
import { rolesGuard } from "../../guards/roles/roles.guard";


export const policyRoutes: Routes = [
  {
    path:'policy/comparison/index',
    component: ComparisonComponent,
    canActivate: [rolesGuard],
    data: {
      roles: ['Admin', 'Manager', 'Analist']
    },
    loadChildren: () => import('./policy.module').then(m => m.PolicyModule)
  },
  {
    path:'policy/manage/index',
    component: ManageComponent,
    canActivate: [rolesGuard],
    data: {
      roles: ['Admin']
    },
    loadChildren: () => import('./policy.module').then(m => m.PolicyModule)
  },
  {
    path:'policy/manage/form',
    component: ManageFormComponent,
    canActivate: [rolesGuard],
    data: {
      roles: ['Admin']
    },
    loadChildren: () => import('./policy.module').then(m => m.PolicyModule)
  }
];
