import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalModule } from '../global/global.module';

import { EquipmentComponent } from './components/equipment/index/equipment.component';
import { EquipmentFormComponent } from './components/equipment/form/equipment-form.component';
import { ManageFormComponent } from './components/manage/form/manage-form.component';
import { ManageComponent } from './components/manage/index/manage.component';


@NgModule({
  declarations: [
    EquipmentComponent,
    EquipmentFormComponent,
    ManageFormComponent,
    ManageComponent
  ],
  imports: [
    CommonModule,
    GlobalModule
  ]
})
export class OfficeModule { }
