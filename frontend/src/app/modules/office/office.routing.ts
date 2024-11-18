import { Routes } from "@angular/router";
import { EquipmentComponent } from "./components/equipment/equipment.component";


export const officeRoutes: Routes = [
  {
    path:'office/equipment',
    component: EquipmentComponent,
    loadChildren: () => import('./office.module').then(m => m.OfficeModule)
  }
];
