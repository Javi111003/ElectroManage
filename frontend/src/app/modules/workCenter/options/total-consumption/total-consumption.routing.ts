import { Routes } from "@angular/router";
import { FormComponent } from "./components/form/form.component";


export const totalConsumptionRoutes: Routes = [
  {
    path:'workCenter/total-consumption/form',
    component: FormComponent,
    loadChildren: () => import('./total-consumption.module').then(m => m.TotalConsumptionModule)
  }
];
