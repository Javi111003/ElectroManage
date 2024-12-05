import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.css'
})
export class CheckboxComponent {
  @Input() label: string = '';
  @Input() options: string[] = [];
  @Output() selectedOptions = new EventEmitter<string[]>();

  chooseOptions = new FormControl('');

  /**
   * Emits the selected options to the parent component.
   * @param event The event emitted by the checkbox selection change.
   */
  onSelectionChange(event: any) {
    this.selectedOptions.emit(event.value);
  }
}
