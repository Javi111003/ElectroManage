import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalModule } from '../global/global.module';
import { SharedModule } from '../../shared/shared.module';

//work center components
import { TotalConsumptionComponent } from './components/total-consumption/total-consumption.component';
import { AvgConsumptionComponent } from './components/avg-consumption/avg-consumption.component';
import { PolicyComponent } from './components/policy/policy.component';

@NgModule({
  declarations: [
    TotalConsumptionComponent,
    AvgConsumptionComponent,
    PolicyComponent
  ],
  imports: [
    CommonModule,
    GlobalModule,
    SharedModule
  ]
})
export class WorkCenterModule { }
