import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalModule } from '../global/global.module';

//work center components
import { RegisterComponent } from './components/register/index/register.component';
import { AvgConsumptionComponent } from './components/avg-consumption/index/avg-consumption.component';
import { AlertComponent } from './components/alert/index/alert.component';
import { ExcessComponent } from './components/excess/index/excess.component';
import { RegisterFormComponent } from './components/register/form/register-form.component';
import { ManageComponent } from './components/manage/index/manage.component';
import { ManageFormComponent } from './components/manage/form/manage-form.component';

@NgModule({
  declarations: [
    RegisterComponent,
    AvgConsumptionComponent,
    AlertComponent,
    ExcessComponent,
    RegisterFormComponent,
    ManageComponent,
    ManageFormComponent
  ],
  imports: [
    CommonModule,
    GlobalModule
  ]
})
export class WorkCenterModule { }
