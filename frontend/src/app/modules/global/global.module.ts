import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';

//global components
import { IndexComponent } from './components/index/index.component';
import { MenuComponent } from './components/menu/menu.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { LoginComponent } from './components/login/login.component';

//global services
import { WorkCenterService } from '../../services/workCenter/work-center.service';
import { OfficeService } from '../../services/office/office.service';

//add the route of each module you need yo import here down.
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '../../shared/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { WorkCenter } from '../../models/workCenter.interface';
import { Office } from '../../models/office.interface';
import {MatBadgeModule} from '@angular/material/badge';


@NgModule({
  declarations: [
    IndexComponent,
    MenuComponent,
    AboutUsComponent,
    LoginComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    NgFor,
    NgIf,
    HttpClientModule,
    ReactiveFormsModule,

    //add all modules you need here down. Remember to add them to export array too.
    MatIconModule,
    SharedModule,
    MatFormFieldModule,
    MatSelectModule,
    MatButtonModule,
    MatTableModule,
    MatBadgeModule
  ],
  exports: [
    HttpClientModule,

    //add the imported modules here down too.
    MatIconModule,
    SharedModule,
    MatFormFieldModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatTableModule
  ]
})
export class GlobalModule {

  constructor(
    private httpCenter: WorkCenterService,
    private httpOffice: OfficeService
  ) {}

  centerStringArray: string[] = [];
  centerObjectArray: WorkCenter[] = [];

  officeStringArray: string[] = [];
  officeObjectArray: Office[] = [];

  centerSelectedId: number | any = 0;

  /**
   * This function retrieves the list of work centers.
   * It updates the options array with the list of available work centers.
   */
  getWorkCenters(): void {
    this.httpCenter.getWorkCenterList().subscribe(workcenters => {
      this.centerObjectArray = workcenters;
      this.centerStringArray = workcenters.map(item => item.name);
    });
  }

  /**
   * This function gets the offices by center ID.
   * It updates the officeOptions based on the selected center.
   */
  getOfficesByCenter(centerID: number): void {
    this.httpOffice.getOfficeList(centerID).subscribe(offices => {
      this.officeObjectArray = offices;
      this.officeStringArray = offices.map(item => item.name);
    });
  }

  /** * Checks if the given option exists in the provided array.
  * * This function iterates over the array to check if the specified
  * option is present.
  * @param array - The array of strings to search within.
  * @param option - The option to search for in the array.
  * @returns - Returns `true` if the option is found, `false` otherwise.
  */
  isOptionValid(array: string[], option: string): boolean {
    for (let index = 0; index < array.length; index++) {
      if (option === array[index])
        return true;
    }

    return false;
  }

  /** * Finds the ID of the selected center based on its name.
  * @param centerSelected The name of the selected center.
  */
  findCenterId(centerSelected: string): void {
    this.centerSelectedId = this.centerObjectArray.find(
      item => item.name === centerSelected
    )?.id;
  }

  /** This function resets all variables
  * to their initial default values. Use this function to
  * clear any temporary states and start fresh.
  */
  Reset() {
    this.centerStringArray = [];
    this.centerObjectArray = [];
    this.officeStringArray = [];
    this.officeObjectArray = [];
    this.centerSelectedId = -1;
  }
}
