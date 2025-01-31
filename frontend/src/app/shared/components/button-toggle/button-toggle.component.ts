import { Component, Input } from '@angular/core';
import { Item } from '../../shared.module';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-button-toggle',
  templateUrl: './button-toggle.component.html',
  styleUrl: './button-toggle.component.css'
})
export class ButtonToggleComponent {
  @Input() options: Item[] = []
  @Input() control: FormControl = [][0];
}
