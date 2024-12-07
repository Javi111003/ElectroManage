import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalModule } from '../global/global.module';

//policy components
import { ComparisonComponent } from './components/comparison/index/comparison.component';
import { ManageFormComponent } from './components/manage/form/manage-form.component';
import { ManageComponent } from './components/manage/index/manage.component';



@NgModule({
  declarations: [
    ComparisonComponent,
    ManageFormComponent,
    ManageComponent
  ],
  imports: [
    CommonModule,
    GlobalModule
  ]
})
export class PolicyModule { }
