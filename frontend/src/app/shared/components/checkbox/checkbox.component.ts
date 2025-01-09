import { Component, Input } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Item } from '../../shared.module';

@Component({
  selector: 'app-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrl: './checkbox.component.css'
})
export class CheckboxComponent {
  @Input() label: string = '';
  @Input() options: Item[] = [];
  @Input() control: FormControl = new FormControl();
}
