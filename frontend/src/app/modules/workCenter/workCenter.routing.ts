import { Routes } from "@angular/router";
import { RegisterComponent } from "./components/register/index/register.component";
import { AvgConsumptionComponent } from "./components/avg-consumption/index/avg-consumption.component";
import { AlertComponent } from "./components/alert/index/alert.component";
import { ExcessComponent } from "./components/excess/index/excess.component";


export const workCenterRoutes: Routes = [
  {
    path:'workCenter/register/index',
    component: RegisterComponent,
    loadChildren: () => import('./workCenter.module').then(m => m.WorkCenterModule)
  },
  {
    path: 'workCenter/register/form',
    component: RegisterComponent,
    loadChildren: () => import('./workCenter.module').then(m => m.WorkCenterModule)
  },
  {
    path:'workCenter/avg-consumption/index',
    component: AvgConsumptionComponent,
    loadChildren: () => import('./workCenter.module').then(m => m.WorkCenterModule)
  },
  {
    path:'workCenter/alert/index',
    component: AlertComponent,
    loadChildren: () => import('./workCenter.module').then(m => m.WorkCenterModule)
  },
  {
    path:'workCenter/excess/index',
    component: ExcessComponent,
    loadChildren: () => import('./workCenter.module').then(m => m.WorkCenterModule)
  }
];
