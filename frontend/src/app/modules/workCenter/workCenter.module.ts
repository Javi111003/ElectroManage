import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalModule } from '../global/global.module';

//work center components
import { TotalConsumptionComponent } from './components/total-consumption/total-consumption.component';
import { AvgConsumptionComponent } from './components/avg-consumption/avg-consumption.component';
import { PolicyComponent } from './components/policy/policy.component';
import { AlertComponent } from './components/alert/alert.component';
import { RankingComponent } from './components/ranking/ranking.component';

@NgModule({
  declarations: [
    TotalConsumptionComponent,
    AvgConsumptionComponent,
    PolicyComponent,
    AlertComponent,
    RankingComponent
  ],
  imports: [
    CommonModule,
    GlobalModule
  ]
})
export class WorkCenterModule { }
