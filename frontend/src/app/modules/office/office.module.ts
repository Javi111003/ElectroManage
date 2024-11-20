import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './components/index/index.component';
import { GlobalModule } from '../global/global.module';



@NgModule({
  declarations: [
    IndexComponent,
  ],
  imports: [
    CommonModule,
    GlobalModule
  ]
})
export class OfficeModule { }
