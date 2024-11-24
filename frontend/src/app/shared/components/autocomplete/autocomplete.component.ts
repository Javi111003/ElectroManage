import { Component, EventEmitter, Input, OnInit, Output,SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { map, startWith } from 'rxjs/operators';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.css'
})
export class AutocompleteComponent implements OnInit {
  @Input() options: string[] = [];
  @Input() label: string = '';
  @Output() optionSelected = new EventEmitter<string>();
  @Output() isOptionSelected = new EventEmitter<boolean>();

  myControl: FormControl = new FormControl('');
  filteredOptions: Observable<string[]> = [][0];

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['options']) {
      // Si las opciones cambian, actualiza los filtros o realiza cualquier acción adicional si es necesario
      this.filteredOptions = this.myControl.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || '')),
      );
    }
  }

  /**
   * Emits the selected option to the parent component.
   * @param event The event emitted by the option selection.
   */
  onOptionSelected(event: any) {
    this.optionSelected.emit(event.option.value);
  }

  /**
   * Filters the options based on the input value.
   * @param value The input value to filter options against.
   * @returns An array of options that match the input value.
   */
  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().startsWith(filterValue));
  }
}
