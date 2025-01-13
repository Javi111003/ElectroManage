import { Component, EventEmitter, Input, OnInit, Output, SimpleChanges } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable, of } from 'rxjs';
import { map, startWith } from 'rxjs/operators';
import { Item } from '../../shared.module';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'app-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrl: './autocomplete.component.css'
})
export class AutocompleteComponent implements OnInit {
  @Input() options: Item[] = [];
  @Input() label: string = '';
  @Input() isDisabled: boolean = false;
  @Input() control: FormControl = new FormControl();
  @Input() showIcon: boolean = false;
  @Input() deleteOption: (...args: any[]) => any = ()=>{};

  filteredOptions: Observable<Item[]> = [][0];

  ngOnInit() {
    this.filteredOptions = this.control.valueChanges.pipe(
      startWith(''),
      map(value => this._filter(value || '')),
    );
    this.control.valueChanges.pipe(
      startWith(''),
      map(value => {
        return this._filter(value || '');
      })
    ).subscribe(filtered => {
      this.filteredOptions = of(filtered);
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['options']) {
      this.filteredOptions = this.control.valueChanges.pipe(
        startWith(''),
        map(value => this._filter(value || '')),
      );
    }
  }

  /**
   * Filters the options based on the input value.
   * @param value The input value to filter options against.
   * @returns An array of options that match the input value.
   */
  private _filter(value: string): Item[] {
    let filterValue = value;
    if (typeof value === 'string') {
      filterValue = value.toLowerCase();
      return this.options.filter(option => option.name.toLowerCase().startsWith(filterValue));
    }

    return [];
  }

  removeOption(option: Item): void {
    this.options = this.options.filter(item => item.id !== option.id);
    this.filteredOptions = this.control.valueChanges.pipe(startWith(''), map(value => this._filter(value)));
    this.deleteOption(option);
  }

  displayFn(option: Item): string {
    return option && option.name ? option.name : '';
  }
}
