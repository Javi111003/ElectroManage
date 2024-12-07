import { Routes } from "@angular/router";
import { ComparisonComponent } from "./components/comparison/index/comparison.component";


export const policyRoutes: Routes = [
  {
    path:'policy/comparison/index',
    component: ComparisonComponent,
    loadChildren: () => import('./policy.module').then(m => m.PolicyModule)
  }
];
