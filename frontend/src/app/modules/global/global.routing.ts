import { Routes } from "@angular/router";
import { IndexComponent } from "./components/index/index.component";
import { AboutUsComponent } from "./components/about-us/about-us.component";
import { rolesGuard } from "../../guards/roles/roles.guard";


export const globalRoutes: Routes = [
  {
    path:'',
    component: IndexComponent,
    canActivate: [rolesGuard],
    data: {
      roles: ['Admin', 'Manager', 'Analist']
    },
    loadChildren: () => import('./global.module').then(m => m.GlobalModule)
  },
  {
    path:'aboutUs',
    component: AboutUsComponent,
    canActivate: [rolesGuard],
    data: {
      roles: ['Admin', 'Manager', 'Analist']
    },
    loadChildren: () => import('./global.module').then(m => m.GlobalModule)
  }
];
