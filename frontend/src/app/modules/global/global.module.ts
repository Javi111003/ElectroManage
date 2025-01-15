import { UserLogged } from './../../models/credential.interface';
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

//global directives
import { PasswordValidatorDirective } from '../../directives/password/password.directive';
import { NumberValidationDirective } from '../../directives/numberValidation/number.validation.directive';
import { EmailValidationDirective } from '../../directives/emailValidation/email-validation.directive';
import { ShowForRolesDirective } from '../../directives/showForRoles/show-for-roles.directive';

//add the route of each module you need yo import here down.
import { MatIconModule } from '@angular/material/icon';
import { Item, SharedModule } from '../../shared/shared.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatButtonModule } from '@angular/material/button';
import { MatTableModule } from '@angular/material/table';
import { MatBadgeModule } from '@angular/material/badge';
import { MatDialog } from '@angular/material/dialog';
import { Observable } from 'rxjs';

@NgModule({
  declarations: [
    IndexComponent,
    MenuComponent,
    AboutUsComponent,
    LoginComponent,
    PasswordValidatorDirective,
    NumberValidationDirective,
    EmailValidationDirective,
    ShowForRolesDirective
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
    NumberValidationDirective,
    EmailValidationDirective,
    ShowForRolesDirective
  ]
})
export class GlobalModule {

  constructor(
    public httpCenter: WorkCenterService,
    public httpOffice: OfficeService,
    public dialog: MatDialog
  ) { }

  workCenters: Item[] = [];
  offices: Item[] = [];

  /**
   * This function retrieves the user information from the session storage.
   * @returns The user information as a UserLogged object.
   */
  getUserInfo(): UserLogged {
    return JSON.parse(sessionStorage.getItem('userLogged') || '{}');
  }

  /**
   * This function retrieves the list of work centers.
   * It updates the options array with the list of available work centers.
   */
  getWorkCenters(): void {
    this.httpCenter.getWorkCenterList().subscribe(workCenters => {
      this.workCenters = workCenters.map(item => {
        return {
          id: item.id,
          name: item.name
        }
      })
    });
  }

  /**
   * This function gets the offices by center ID.
   * It updates the officeOptions based on the selected center.
   */
  getOfficesByCenter(centerID: number): Observable<any> {
    const observable = this.httpOffice.getOfficeList(centerID);
    observable.subscribe(offices => {
      this.offices = offices.map(office => {
        return {
          id: office.id,
          name: office.name
        }
      });
    });

    return observable;
  }

  /**
   * Checks if all the provided options are valid.
   * This function iterates over the options and checks if the specified option is greather than zero
   * which means that is valid.
   * @param options The array of ids.
   * @param response The array to store the response for each option.
   * @returns `[true, '']` if all the options are valid, `[false, response[i]]` otherwise.
   */
  allValid(options: number[], response: string[]): [boolean, string] {
    for (let i = 0; i < options.length; i++) {
      if (!options[i])
        return [false, response[i]];
    }

    return [true, ''];
  }

  /**
   * Opens a dialog with a specified message.
   * This function is used to display a message to the user in a dialog box.
   * @param message The message to be displayed in the dialog.
   * @param showConfirmButton A boolean value indicating whether the "Confirm" button
   * should be displayed in the dialog.
   */
  openDialog(message: string, showConfirmButton: boolean = false): Observable<boolean> {
    const dialogRef = this.dialog.open(DialogComponent, {
      data: {
        message: message,
        showConfirmButton: showConfirmButton
      }
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
    this.workCenters = [];
    this.offices = [];
  }
}
