import {ChangeDetectionStrategy, Component, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

@Component({
  selector: 'app-dialog',
  templateUrl: './dialog.component.html',
  styleUrl: './dialog.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DialogComponent {
  constructor(
    public dialogRef: MatDialogRef<DialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: {
      message: string,
      showConfirmButton: boolean
    }
  ) {}

  /**
   * This function is used to close the dialog and return a value of true.
   * It is triggered when the user clicks on the "Confirmar" button.
   */
  onConfirm(): void {
    this.dialogRef.close(true);
  }

  /**
   * This function is used to close the dialog and return a value of false.
   * It is triggered when the user clicks on the "Cerrar" button.
   */
  onCancel(): void {
    this.dialogRef.close(false);
  }
}
