import { Routes } from "@angular/router";
import { RegisterComponent } from "./components/register/index/register.component";
import { AvgConsumptionComponent } from "./components/avg-consumption/index/avg-consumption.component";
import { AlertComponent } from "./components/alert/index/alert.component";
import { ExcessComponent } from "./components/excess/index/excess.component";
import { ManageComponent } from "./components/manage/index/manage.component";
import { ManageFormComponent } from "./components/manage/form/manage-form.component";
import { LocationComponent } from "./components/location/index/location-index.component";
import { rolesGuard } from "../../guards/roles/roles.guard";


export const workCenterRoutes: Routes = [
  {
    path:'workCenter/location/index',
    component: LocationComponent,
    canActivate: [rolesGuard],
    data: {
      roles: ['Admin', 'Manager', 'Analist']
    },
    loadChildren: () => import('./workCenter.module').then(m => m.WorkCenterModule)
  },
  {
    path:'workCenter/register/index',
    component: RegisterComponent,
    canActivate: [rolesGuard],
    data: {
      roles: ['Admin', 'Manager', 'Analist']
    },
    loadChildren: () => import('./workCenter.module').then(m => m.WorkCenterModule)
  },
  {
    path: 'workCenter/register/form',
    component: RegisterComponent,
    canActivate: [rolesGuard],
    data: {
      roles: ['Admin', 'Manager']
    },
    loadChildren: () => import('./workCenter.module').then(m => m.WorkCenterModule)
  },
  {
    path:'workCenter/avg-consumption/index',
    component: AvgConsumptionComponent,
    canActivate: [rolesGuard],
    data: {
      roles: ['Admin', 'Manager', 'Analist']
    },
    loadChildren: () => import('./workCenter.module').then(m => m.WorkCenterModule)
  },
  {
    path:'workCenter/alert/index',
    component: AlertComponent,
    canActivate: [rolesGuard],
    data: {
      roles: ['Admin', 'Manager', 'Analist']
    },
    loadChildren: () => import('./workCenter.module').then(m => m.WorkCenterModule)
  },
  {
    path:'workCenter/excess/index',
    component: ExcessComponent,
    canActivate: [rolesGuard],
    data: {
      roles: ['Admin']
    },
    loadChildren: () => import('./workCenter.module').then(m => m.WorkCenterModule)
  },
  {
    path:'workCenter/manage/index',
    component: ManageComponent,
    canActivate: [rolesGuard],
    data: {
      roles: ['Admin', 'Manager']
    },
    loadChildren: () => import('./workCenter.module').then(m => m.WorkCenterModule)
  },
  {
    path:'workCenter/manage/form',
    component: ManageFormComponent,
    canActivate: [rolesGuard],
    data: {
      roles: ['Admin', 'Manager']
    },
    loadChildren: () => import('./workCenter.module').then(m => m.WorkCenterModule)
  }
];
