import { Routes } from "@angular/router";
import { EquipmentComponent } from "./components/equipment/index/equipment.component";
import { EquipmentFormComponent } from "./components/equipment/form/equipment-form.component";
import { ManageComponent } from "./components/manage/index/manage.component";
import { ManageFormComponent } from "./components/manage/form/manage-form.component";
import { rolesGuard } from "../../guards/roles/roles.guard";


export const officeRoutes: Routes = [
  {
    path:'office/equipment/index',
    component: EquipmentComponent,
    canActivate: [rolesGuard],
    data: {
      roles: ['Admin', 'Manager', 'Analist']
    },
    loadChildren: () => import('./office.module').then(m => m.OfficeModule)
  },
  {
    path:'office/equipment/form',
    component: EquipmentFormComponent,
    canActivate: [rolesGuard],
    data: {
      roles: ['Admin', 'Manager']
    },
    loadChildren: () => import('./office.module').then(m => m.OfficeModule)
  },
  {
    path:'office/manage/index',
    component: ManageComponent,
    canActivate: [rolesGuard],
    data: {
      roles: ['Admin', 'Manager']
    },
    loadChildren: () => import('./office.module').then(m => m.OfficeModule)
  },
  {
    path:'office/equipment/form',
    component: ManageFormComponent,
    canActivate: [rolesGuard],
    data: {
      roles: ['Admin', 'Manager']
    },
    loadChildren: () => import('./office.module').then(m => m.OfficeModule)
  }
];
