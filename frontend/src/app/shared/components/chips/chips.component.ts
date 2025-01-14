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
  @Input() deleteOption: (...args: any[]) => any = () => {};
  @Input() validateOption: (...args: any[]) => boolean = () => true;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];
  readonly currentOption = model('');
  filteredOptions = computed(() => {
    let currentOption = null;
    if (typeof this.currentOption() === "string")
      currentOption = this.currentOption().toLowerCase();
    return currentOption
      ? this.allOptions.filter(option => option.name.toLowerCase().includes(currentOption))
      : this.allOptions.slice();
  });

  /**
   * This function is used to add a new option to the chip list.
   * It first checks if the option already exists in the list, and if not, it adds the new option.
   * If the new option is valid, it updates the options and calls the function with the new options.
   * If the new option is not valid, it displays an alert.
   * @param event - The event that triggered the function.
   */
  add(event: MatChipInputEvent): void {
    const value = (event.value || '').trim();
    const id = this.allOptions.length;
    const obj = {
      id: id,
      name: value
    };

    if (this.allOptions.find(option => option.name === value) != undefined)
      return;

    const validate = this.validateOption(value);
    if (value && validate) {
      this.options.update(options => [...options, obj]);
      this.allOptions.push(obj);
    }

    this.function(value, validate);
    this.currentOption.set('');
  }

  /**
   * This function is used to remove an option from the chip list.
   * It updates the options array by removing the specified option and announces the removal.
   * It also calls the function with the updated options.
   * @param option - The option to be removed.
   */
  remove(option: Item): void {
    this.options.update(options => {
      const index = options.indexOf(option);
      if (index < 0) {
        return options;
      }

      options.splice(index, 1);
      return [...options];
    });

    this.function(option);
  }

  /**
   * This function is used to handle the selection of an option from the autocomplete list.
   * It deselects the option that was selected.
   * @param event - The event that triggered the function.
   */
  selectedOption(event: MatAutocompleteSelectedEvent): void {
    event.option.deselect();
  }

  /**
   * This function is used to handle the selection of an option from the chip list.
   * It adds the selected option to the options array and clears the current option input.
   * It also calls the function with the updated options.
   * @param event - The event that triggered the function.
   */
  selected(event: Item): void {
    const option = event;
    this.options.update(options => [...options, option]);
    this.currentOption.set('');
    this.function(this.options());
  }

  /**
   * This function is used to handle the action of an option from the chip list.
   * It calls the function with the specified option.
   * @param option - The option for which the action is to be performed.
   */
  action(option: Item): void {
    this.function(option);
  }

  /**
   * This function is used to remove an option from the chip list.
   * It removes the specified option from the options array and updates the filtered options.
   * It also calls the function with the updated options.
   * @param option - The option to be removed.
   */
  removeOption(option: Item): void {
    this.allOptions = this.allOptions.filter(item => item !== option);
    this.options.update(options => options = this.options().filter(item => item.id !== option.id));
    this.filteredOptions = computed(() => {
      let currentOption = null;
      if (typeof this.currentOption() === "string")
        currentOption = this.currentOption().toLowerCase();
      return currentOption
        ? this.allOptions.filter(option => option.name.toLowerCase().includes(currentOption))
        : this.allOptions.slice();
    });
    this.deleteOption(option);
  }
}
