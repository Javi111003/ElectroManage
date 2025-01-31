import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableComponent } from './components/table/table.component';
import { DatepickerComponent } from './components/datepicker/datepicker.component';
import { ButtonComponent } from './components/button/button.component';
import { AutocompleteComponent } from './components/autocomplete/autocomplete.component';
import { CheckboxComponent } from './components/checkbox/checkbox.component';
import { DialogComponent } from './components/dialog/dialog.component';
import { ProgressSpinnerComponent } from './components/progress-spinner/progress-spinner.component';
import { ChipsComponent } from './components/chips/chips.component';
import { SnackbarComponent } from './components/snackbar/snackbar.component';
import { NoResultsComponent } from './components/no-results/no-results.component';
import { ButtonToggleComponent } from './components/button-toggle/button-toggle.component';

import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AsyncPipe } from '@angular/common';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatSelectModule } from '@angular/material/select';
import { MatDialogActions, MatDialogClose, MatDialogContent, MatDialogTitle } from '@angular/material/dialog';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { CdkDrag, CdkDropList } from '@angular/cdk/drag-drop';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonToggleModule } from '@angular/material/button-toggle';

@NgModule({
  declarations: [
    TableComponent,
    ButtonComponent,
    AutocompleteComponent,
    DatepickerComponent,
    CheckboxComponent,
    DialogComponent,
    ProgressSpinnerComponent,
    ChipsComponent,
    SnackbarComponent,
    NoResultsComponent,
    ButtonToggleComponent
  ],
  imports: [
    CommonModule,
    MatTableModule,
    MatIconModule,
    MatPaginator,
    MatPaginatorModule,
    MatSort,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    AsyncPipe,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatSelectModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatProgressSpinnerModule,
    CdkDrag,
    CdkDropList,
    MatChipsModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatButtonToggleModule
  ],
  exports: [
    TableComponent,
    ButtonComponent,
    AutocompleteComponent,
    DatepickerComponent,
    CheckboxComponent,
    ProgressSpinnerComponent,
    ChipsComponent,
    SnackbarComponent,
    NoResultsComponent,
    ButtonToggleComponent,

    MatTableModule,
    MatIconModule,
    MatPaginator,
    MatPaginatorModule,
    MatSort,
    MatSortModule,
    MatInputModule,
    MatFormFieldModule,
    AsyncPipe,
    MatAutocompleteModule,
    FormsModule,
    ReactiveFormsModule,
    MatDatepickerModule,
    MatSelectModule,
    MatDialogActions,
    MatDialogClose,
    MatDialogContent,
    MatDialogTitle,
    MatProgressSpinnerModule,
    CdkDrag,
    CdkDropList,
    MatChipsModule,
    MatProgressBarModule,
    MatTooltipModule,
    MatButtonToggleModule
  ]
})
export class SharedModule { }

// Autocomplete input
export interface Item {
  id: number;
  name: string;
}
