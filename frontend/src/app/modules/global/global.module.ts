import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { NgFor, NgIf } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DialogComponent } from '../../shared/components/dialog/dialog.component';

//global components
import { IndexComponent } from './components/index/index.component';
import { MenuComponent } from './components/menu/menu.component';
import { AboutUsComponent } from './components/about-us/about-us.component';
import { LoginComponent } from './components/login/login.component';

//global services
import { WorkCenterService } from '../../services/workCenter/work-center.service';
import { OfficeService } from '../../services/office/office.service';
import { TranslationService } from '../../services/translation/translation.service';

//global directives
import { PasswordValidatorDirective } from '../../directives/password/password.directive';
import { NumberValidationDirective } from '../../directives/numberValidation/number.validation.directive';

//add the route of each module you need yo import here down.
import { MatIconModule } from '@angular/material/icon';
import { SharedModule } from '../../shared/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { WorkCenter } from '../../models/workCenter.interface';
import { OfficeInfo } from '../../models/office.interface';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { UserLogged } from '../../models/credential.interface';

@NgModule({
  declarations: [
    IndexComponent,
    MenuComponent,
    AboutUsComponent,
    LoginComponent,
    PasswordValidatorDirective,
    NumberValidationDirective
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
    MatTableModule,
    PasswordValidatorDirective,
    NumberValidationDirective
  ]
})
export class GlobalModule {

  constructor(
    public httpCenter: WorkCenterService,
    public httpOffice: OfficeService,
    public dialog: MatDialog,
    private httpTranslate: TranslationService
  ) {}

  userInfo: UserLogged = [][0];

  centerStringArray: string[] = [];
  centerObjectArray: WorkCenter[] = [];

  officeStringArray: string[] = [];
  officeObjectArray: OfficeInfo[] = [];

  centerSelectedId: number | any = 0;
  officeSelectedId: number | any = 0;

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
  getOfficesByCenter(centerID: number): Observable<any> {
    const observable = this.httpOffice.getOfficeList(centerID);
    observable.subscribe(offices => {
      this.officeObjectArray = offices;
      this.officeStringArray = offices.map(item => item.name);
    });

    return observable;
  }

  /**
   * Checks if the given option exists in the provided array.
   * This function iterates over the array to check if the specified
   * option is present.
   * @param array The array of strings to search within.
   * @param option The option to search for in the array.
   * @returns `true` if the option is found, `false` otherwise.
   */
  isOptionValid(array: string[], option: string): boolean {
    for (let index = 0; index < array.length; index++) {
      if (option === array[index])
        return true;
    }

    return false;
  }

  /**
   * Checks if all the provided options are valid for the corresponding data.
   * This function iterates over the data and checks if the specified options are present.
   * @param data The array of arrays of strings to search within.
   * @param options The array of options to search for in the data.
   * @param response The array to store the response for each option.
   * @returns `[true, '']` if all the options are found, `[false, response[i]]` otherwise.
   */
  AllValid(data: string[][], options: string[], response: string[]): [boolean, string] {
    for (let i = 0; i < data.length; i++) {
      if (!data[i].includes(options[i]))
        return [false, response[i]];
    }

    return [true, ''];
  }

  /**
   * Finds the ID of the selected center based on its name.
   * @param centerSelected The name of the selected center.
   */
  findCenterId(centerSelected: string): void {
    this.centerSelectedId = this.centerObjectArray.find(
      item => item.name === centerSelected
    )?.id;
  }

  /**
   * Finds the ID of the selected office based on its name.
   * @param officeSelected The name of the selected office.
   */
  findOfficeId(officeSelected: string): void {
    this.officeSelectedId = this.officeObjectArray.find(
      item => item.name === officeSelected
    )?.id;
  }

  /**
   * Opens a dialog with a specified message.
   * This function is used to display a message to the user in a dialog box.
   * @param message The message to be displayed in the dialog.
   */
  openDialog(message: string): Observable<boolean> {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: { message: message }
    });

    return dialogRef.afterClosed();
  }

  /**
   * Formats a given date into a string in the ISO 8601 format.
   * This function takes a Date object and returns a string representation
   * of the date in the ISO 8601 format, which is YYYY-MM-DDTHH:MM:SS.SSS.
   * @param date The Date object to be formatted.
   * @returns A string representation of the date in ISO 8601 format.
   */
  formatLocalDate(date: Date): string {
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2);
    const day = ('0' + date.getDate()).slice(-2);
    const hours = ('0' + date.getHours()).slice(-2);
    const minutes = ('0' + date.getMinutes()).slice(-2);
    const seconds = ('0' + date.getSeconds()).slice(-2);
    const milliseconds = ('00' + date.getMilliseconds()).slice(-3);

    return `${year}-${month}-${day}T${hours}:${minutes}:${seconds}.${milliseconds}`;
  }

  /**
   * This function resets all variables
   * to their initial default values. Use this function to
   * clear any temporary states and start fresh.
  */
  Reset() {
    this.centerStringArray = [];
    this.centerObjectArray = [];
    this.officeStringArray = [];
    this.officeObjectArray = [];
    this.centerSelectedId = -1;
    this.officeSelectedId = -1;
    this.userInfo = [][0];
  }
}
