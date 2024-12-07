import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GlobalModule } from '../global/global.module';

//policy components
import { ComparisonComponent } from './components/comparison/index/comparison.component';



@NgModule({
  declarations: [
    ComparisonComponent
  ],
  imports: [
    CommonModule,
    GlobalModule
  ]
})
export class PolicyModule { }
