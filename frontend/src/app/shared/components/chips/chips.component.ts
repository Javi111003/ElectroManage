import { Component, Input } from '@angular/core';
import { InputModalityDetector, LiveAnnouncer } from '@angular/cdk/a11y';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { computed, inject, model, signal } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';

@Component({
  selector: 'app-chips',
  templateUrl: './chips.component.html',
  styleUrl: './chips.component.css'
})
export class ChipsComponent {
  @Input() options = signal(['']);
  @Input() allOptions: string[] = [];
  @Input() function: (...arg: any[]) => void = () => {};
  @Input() actionOption: (option: string) => void = (option: string) => {};
  @Input() deleteOption: (...args: any[]) => any = ()=>{};
  @Input() variable: boolean = true;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  readonly currentOption = model('');
  readonly filteredOptions = computed(() => {
    const currentOption = this.currentOption().toLowerCase();
    return currentOption
      ? this.allOptions.filter(option => option.toLowerCase().includes(currentOption))
      : this.allOptions.slice();
  });

  readonly announcer = inject(LiveAnnouncer);

  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();

    // Add our fruit
    if (value) {
      this.options.update(options => [...options, value]);
      this.allOptions.push(value);
      this.function(this.options());
    }

    // Clear the input value
    this.currentOption.set('');
  }

  remove(option: string): void {
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

  selected(event: MatAutocompleteSelectedEvent): void {
    this.options.update(options => [...options, event.option.viewValue]);
    this.currentOption.set('');
    event.option.deselect();
    this.function(this.options());
  }

  action(option: string): void {
    this.function(option);
  }

  removeOption(option: string): void {
    this.options.update(options => options = this.options().filter(item => item !== option));
    this.deleteOption(option);
  }
}
