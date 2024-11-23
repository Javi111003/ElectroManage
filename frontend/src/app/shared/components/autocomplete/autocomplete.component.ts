import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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

  private _filter(value: string): string[] {
    const filterValue = value.toLowerCase();

    return this.options.filter(option => option.toLowerCase().startsWith(filterValue));
  }

  onOptionSelected(event: any) {
    this.optionSelected.emit(event.option.value);
  }
}
