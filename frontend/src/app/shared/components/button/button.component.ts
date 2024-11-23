import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {
  @Input() label: string = 'Descargar PDF';
  @Input() function: (...args: any[])=>any = this.exportPDF;

  exportPDF() {}
}