import { Routes } from "@angular/router";
import { FormComponent } from "./components/form/form.component";


export const avgConsumptionRoutes: Routes = [
  {
    path:'workCenter/avg-consumption/form',
    component: FormComponent,
    loadChildren: () => import('./avg-consumption.module').then(m => m.AvgConsumptionModule)
  }
];
