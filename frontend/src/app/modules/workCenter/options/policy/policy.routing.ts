import { Routes } from "@angular/router";
import { FormComponent } from "./components/form/form.component";


export const policyRoutes: Routes = [
  {
    path:'workCenter/policy/form',
    component: FormComponent,
    loadChildren: () => import('./policy.module').then(m => m.PolicyModule)
  }
];
