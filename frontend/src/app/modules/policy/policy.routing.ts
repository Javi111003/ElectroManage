import { Routes } from "@angular/router";
import { ComparisonComponent } from "./components/comparison/index/comparison.component";
import { ManageComponent } from "./components/manage/index/manage.component";
import { ManageFormComponent } from "./components/manage/form/manage-form.component";


export const policyRoutes: Routes = [
  {
    path:'policy/comparison/index',
    component: ComparisonComponent,
    loadChildren: () => import('./policy.module').then(m => m.PolicyModule)
  },
  {
    path:'policy/manage/index',
    component: ManageComponent,
    loadChildren: () => import('./policy.module').then(m => m.PolicyModule)
  },
  {
    path:'policy/manage/form',
    component: ManageFormComponent,
    loadChildren: () => import('./policy.module').then(m => m.PolicyModule)
  }
];
