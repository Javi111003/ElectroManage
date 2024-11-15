import { Routes } from "@angular/router";
import { IndexComponent } from "./components/index/index.component";


export const officeRoutes: Routes = [
  {
    path:'office/index',
    component: IndexComponent,
    loadChildren: () => import('./office.module').then(m => m.OfficeModule)
  }
];
