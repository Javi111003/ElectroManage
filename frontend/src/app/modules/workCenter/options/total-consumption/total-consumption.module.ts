import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalModule } from '../../../global/global.module';
import { FormComponent } from './components/form/form.component';

import { SharedModule } from '../../../../shared/shared.module';

@NgModule({
  declarations: [
    FormComponent
  ],
  imports: [
    CommonModule,
    GlobalModule,
    SharedModule
  ]
})
export class TotalConsumptionModule { }
