import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './components/index/index.component';
import { MenuComponent } from './components/menu/menu.component';

//add the route of each module you need yo import here down.

@NgModule({
  declarations: [
    IndexComponent,
    MenuComponent
  ],
  imports: [
    CommonModule,

    //add all modules you need here down. Remember to add them to export array too.
  ],
  exports: [
    //add the imported modules here down too.
  ]
})
export class GlobalModule { }
