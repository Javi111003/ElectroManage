import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {
  @Input() label: string = 'Descargar PDF';
  @Input() function: (...args: any[]) => any = this.exportPDF;
  @Input() showIcon: boolean = false;
  @Input() icon: string = '';
  @Input() isDisabled: boolean = false;
  @Input() loading: boolean = false;

  /**
   * This function is used to export a PDF.
   * It is called when the button is clicked.
   */
  exportPDF() {}
}
