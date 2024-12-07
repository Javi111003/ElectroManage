import { Routes } from "@angular/router";
import { EquipmentComponent } from "./components/equipment/index/equipment.component";
import { EquipmentFormComponent } from "./components/equipment/form/equipment-form.component";
import { ManageComponent } from "./components/manage/index/manage.component";
import { ManageFormComponent } from "./components/manage/form/manage-form.component";


export const officeRoutes: Routes = [
  {
    path:'office/equipment/index',
    component: EquipmentComponent,
    loadChildren: () => import('./office.module').then(m => m.OfficeModule)
  },
  {
    path:'office/equipment/form',
    component: EquipmentFormComponent,
    loadChildren: () => import('./office.module').then(m => m.OfficeModule)
  },
  {
    path:'office/manage/index',
    component: ManageComponent,
    loadChildren: () => import('./office.module').then(m => m.OfficeModule)
  },
  {
    path:'office/equipment/form',
    component: ManageFormComponent,
    loadChildren: () => import('./office.module').then(m => m.OfficeModule)
  }
];
