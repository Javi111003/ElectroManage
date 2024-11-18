import { Routes } from "@angular/router";
import { IndexComponent } from "./components/index/index.component";
import { AboutUsComponent } from "./components/about-us/about-us.component";


export const globalRoutes: Routes = [
  {
    path:'',
    component: IndexComponent,
    loadChildren: () => import('./global.module').then(m => m.GlobalModule)
  },
  {
    path:'aboutUs',
    component: AboutUsComponent,
    loadChildren: () => import('./global.module').then(m => m.GlobalModule)
  }
];
