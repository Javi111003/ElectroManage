import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ManageFormComponent } from './components/manage/form/manage-form.component';
import { ManageComponent } from './components/manage/index/manage.component';
import { GlobalModule } from "../global/global.module";


@NgModule({
  declarations: [
    ManageFormComponent,
    ManageComponent
  ],
  imports: [
    CommonModule,
    GlobalModule
]
})
export class UserModule { }
