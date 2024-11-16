import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormComponent } from './components/form/form.component';
import { GlobalModule } from '../../../global/global.module';



@NgModule({
  declarations: [
    FormComponent
  ],
  imports: [
    CommonModule,
    GlobalModule
  ]
})
export class AvgConsumptionModule { }
