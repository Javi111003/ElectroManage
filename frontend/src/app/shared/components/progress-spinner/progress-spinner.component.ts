import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-progress-spinner',
  templateUrl: './progress-spinner.component.html',
  styleUrl: './progress-spinner.component.css'
})
export class ProgressSpinnerComponent {
  @Input() loading: boolean = false;
}
