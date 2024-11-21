import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalModule } from '../global/global.module';


import { EquipmentComponent } from './components/equipment/equipment.component';


@NgModule({
  declarations: [
    EquipmentComponent
  ],
  imports: [
    CommonModule,
    GlobalModule
  ]
})
export class OfficeModule { }
