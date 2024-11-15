import { Routes } from "@angular/router";
import { IndexComponent } from "./components/index/index.component";


export const workCenterRoutes: Routes = [
  {
    path:'workCenter/index',
    component: IndexComponent,
    loadChildren: () => import('./workCenter.module').then(m => m.WorkCenterModule)
  }
];
