import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageFormComponent } from './components/manage/form/manage-form.component';
import { ManageComponent } from './components/manage/index/manage.component';



@NgModule({
  declarations: [
    ManageFormComponent,
    ManageComponent
  ],
  imports: [
    CommonModule
  ]
})
export class UserModule { }
