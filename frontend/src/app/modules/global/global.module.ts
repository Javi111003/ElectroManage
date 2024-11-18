import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IndexComponent } from './components/index/index.component';
import { MenuComponent } from './components/menu/menu.component';
import { RouterModule } from '@angular/router';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { NgFor, NgIf } from '@angular/common';

//add the route of each module you need yo import here down.
import {MatIconModule} from '@angular/material/icon';

@NgModule({
  declarations: [
    IndexComponent,
    MenuComponent,
    AboutUsComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgFor,
    NgIf,

    //add all modules you need here down. Remember to add them to export array too.
    MatIconModule,
  ],
  exports: [
    //add the imported modules here down too.
    MatIconModule,
  ]
})
export class GlobalModule { }
