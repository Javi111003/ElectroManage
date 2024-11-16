import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalModule } from '../../../global/global.module';
import { FormComponent } from './components/form/form.component';



@NgModule({
  declarations: [
    FormComponent
  ],
  imports: [
    CommonModule,
    GlobalModule
  ]
})
export class TotalConsumptionModule { }
