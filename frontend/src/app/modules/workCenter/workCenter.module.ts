import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalModule } from '../global/global.module';

//work center components
import { RegisterComponent } from './components/register/index/register.component';
import { AvgConsumptionComponent } from './components/avg-consumption/avg-consumption.component';
import { PolicyComponent } from './components/policy/policy.component';
import { AlertComponent } from './components/alert/alert.component';
import { ExcessComponent } from './components/excess/excess.component';
import { RegisterFormComponent } from './components/register/form/register-form.component';

@NgModule({
  declarations: [
    RegisterComponent,
    AvgConsumptionComponent,
    PolicyComponent,
    AlertComponent,
    ExcessComponent,
    RegisterFormComponent
  ],
  imports: [
    CommonModule,
    GlobalModule
  ]
})
export class WorkCenterModule { }
