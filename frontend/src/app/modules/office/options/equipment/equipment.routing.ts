import { Routes } from "@angular/router";
import { FormComponent } from "./components/form/form.component";


export const equipmentRoutes: Routes = [
  {
    path:'office/equipment/form',
    component: FormComponent,
    loadChildren: () => import('./equipment.module').then(m => m.EquipmentModule)
  }
];
