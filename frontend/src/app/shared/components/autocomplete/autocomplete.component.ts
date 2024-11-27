import { Component, EventEmitter, Input, OnInit, Output,SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
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
  @Output() inputModified = new EventEmitter<string>();

  myControl: FormControl = new FormControl('');
  filteredOptions: Observable<string[]> = [][0];

  ngOnInit() {
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
    this.myControl.valueChanges.pipe(
      startWith(''), // Valor inicial vacío.
      map(value => {
        this.inputModified.emit(value); // Emitir el valor modificado al padre.
        return this._filter(value || ''); // Filtrar las opciones.
      })
    ).subscribe(filtered => {
      this.filteredOptions = of(filtered); // Asegurar que siempre sea un Observable<string[]>.
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['options']) {
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

  resetControl(): void {
    this.myControl.reset(''); // Reinicia el valor del FormControl
    this.filteredOptions = this.myControl.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
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
