import { Component, Input } from '@angular/core';
import { LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { computed, inject, model, signal } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Item } from '../../shared.module';

@Component({
  selector: 'app-chips',
  templateUrl: './chips.component.html',
  styleUrl: './chips.component.css'
})
export class ChipsComponent {
  @Input() label: string = '';
  @Input() options = signal([
    {
      id: 0,
      name: ''
    }
  ]);
  @Input() allOptions: Item[] = [];
  @Input() variable: boolean = true;
  @Input() function: (...arg: any[]) => void = () => {};
  @Input() deleteOption: (...args: any[]) => any = ()=>{};
  @Input() validateOption: (...args: any[]) => boolean = ()=>{ return true; };

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  readonly currentOption = model('');
  filteredOptions = computed(() => {
    const currentOption = this.currentOption().toLowerCase();
    return currentOption
      ? this.allOptions.filter(option => option.name.toLowerCase().includes(currentOption))
      : this.allOptions.slice();
  });

  readonly announcer = inject(LiveAnnouncer);

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    const id = this.allOptions.length;
    const obj = {
      id: id,
      name: value
    };

    if (this.allOptions.find(option => option.name === value) != undefined)
      return;

    if (value && this.validateOption(value)) {
      this.options.update(options => [...options, obj]);
      this.allOptions.push(obj);
      this.function(this.options());
    }

    this.currentOption.set('');
    if (!this.validateOption(value)) {
      alert('Opción inválida');
    }
  }

  remove(option: Item): void {
    this.options.update(options => {
      const index = options.indexOf(option);
      if (index < 0) {
        return options;
      }

      options.splice(index, 1);
      this.announcer.announce(`Removed ${option}`);
      return [...options];
    });

    this.function(this.options());
  }

  selectedOption(event: MatAutocompleteSelectedEvent) {
    event.option.deselect();
  }

  selected(event: Item): void {
    const option = event;
    this.options.update(options => [...options, option]);
    this.currentOption.set('');
    this.function(this.options());
  }

  action(option: Item): void {
    this.function(option);
  }

  removeOption(option: Item): void {
    this.allOptions = this.allOptions.filter(item => item !== option);
    this.options.update(options => options = this.options().filter(item => item.name !== option.name));
    this.filteredOptions = computed(() => {
      const currentOption = this.currentOption().toLowerCase();
      return currentOption
        ? this.allOptions.filter(option => option.name.toLowerCase().includes(currentOption))
        : this.allOptions.slice();
    });
    this.deleteOption(option);
  }
}
