import { Routes } from "@angular/router";
import { TotalConsumptionComponent } from "./components/total-consumption/total-consumption.component";
import { AvgConsumptionComponent } from "./components/avg-consumption/avg-consumption.component";
import { PolicyComponent } from "./components/policy/policy.component";
import { AlertComponent } from "./components/alert/alert.component";
import { ExcessComponent } from "./components/excess/excess.component";


export const workCenterRoutes: Routes = [
  {
    path:'workCenter/total-consumption',
    component: TotalConsumptionComponent,
    loadChildren: () => import('./workCenter.module').then(m => m.WorkCenterModule)
  },
  {
    path:'workCenter/avg-consumption',
    component: AvgConsumptionComponent,
    loadChildren: () => import('./workCenter.module').then(m => m.WorkCenterModule)
  },
  {
    path:'workCenter/policy',
    component: PolicyComponent,
    loadChildren: () => import('./workCenter.module').then(m => m.WorkCenterModule)
  },
  {
    path:'workCenter/alert',
    component: AlertComponent,
    loadChildren: () => import('./workCenter.module').then(m => m.WorkCenterModule)
  },
  {
    path:'workCenter/excess',
    component: ExcessComponent,
    loadChildren: () => import('./workCenter.module').then(m => m.WorkCenterModule)
  }
];
