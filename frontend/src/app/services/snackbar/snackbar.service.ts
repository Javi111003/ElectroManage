import { Injectable } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarComponent } from '../../shared/components/snackbar/snackbar.component';

@Injectable({
  providedIn: 'root'
})
export class SnackbarService {
  constructor(private snackBar: MatSnackBar) { }

  /**
   * Opens a snackbar with a given message and duration.
   * This method uses the MatSnackBar service to open a snackbar from a component.
   * The snackbar displays the provided message and remains open for the specified duration.
   * @param message The message to be displayed in the snackbar.
   * @param duration The duration in milliseconds for which the snackbar will be open.
   */
  openSnackBar(message: string, duration: number = 3000) {
    this.snackBar.openFromComponent(SnackbarComponent, {
      data: { message: message },
      duration: duration,
      verticalPosition: 'bottom',
      horizontalPosition: 'right'
    });
  }
}
