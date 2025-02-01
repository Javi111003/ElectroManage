import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { COMMA, ENTER } from '@angular/cdk/keycodes';
import { computed, model, signal } from '@angular/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { MatChipInputEvent } from '@angular/material/chips';
import { Item } from '../../shared.module';
import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-chips',
  templateUrl: './chips.component.html',
  styleUrl: './chips.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChipsComponent {
  @Input() label: string = '';
  @Input() placeholder: string = "Añadir etiqueta...";
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

    const validate = this.validateOption(value);
    if (value && validate) {
      this.options.update(options => [...options, obj]);
      this.allOptions.push(obj);
    }

    this.function(value, validate);
    this.currentOption.set('');
  }

  /**
   * Handles the click event for a chip and performs various operations based on the chip's name.
   *
   * This function takes the name of the chip, trims any extra whitespace, and creates an object with a unique ID
   * and the trimmed name. It then validates the name and if the validation passes, updates the options list and
   * appends the new object to the allOptions array. Finally, it calls another function with the value and validation result
   * and resets the current option.
   *
   * @param name - The name of the chip that was clicked.
   * @void
   */
  onChipClick(name: string): void {
    const value = (name || '').trim();
    const id = this.allOptions.length;
    const obj = {
      id: id,
      name: value
    };

    if (value) {
      this.options.update(options => [...options, obj]);
      this.allOptions.push(obj);
    }

    this.function(value, true);
    this.currentOption.set('');
  }

  /**
   * Handles the drop event for drag-and-drop functionality and updates the options list.
   *
   * This function takes a drag-and-drop event, moves the item within the options array
   * from its previous index to its current index, logs the event to the console,
   * and returns the updated options array.
   *
   * @param {CdkDragDrop<Item[]>} event - The drag-and-drop event containing information about the moved item.
   * @void
   */
  drop(event: CdkDragDrop<Item[]>) {
    this.options.update(options => {
      moveItemInArray(options, event.previousIndex, event.currentIndex);
      console.log(event);
      return [...options];
    });
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
