import { Component, Input } from '@angular/core';
import { Item } from '../../shared.module';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-button',
  templateUrl: './button.component.html',
  styleUrl: './button.component.css'
})
export class ButtonComponent {
  @Input() label: string = 'Exportar';
  @Input() function: (...args: any[]) => any = this.toggleExportMenu;
  @Input() showIcon: boolean = false;
  @Input() icon: string = '';
  @Input() isDisabled: boolean = false;
  @Input() loading: boolean = false;
  @Input() control: FormControl = [][0];
  @Input() isExportToggle: boolean = false;
  @Input() exportFunction: (...args: any[]) => any = () => {};
  @Input() options: Item[] = [
    {
      id: 1,
      name: "pdf"
    },
    {
      id: 2,
      name: "docx"
    },
    {
      id: 3,
      name: "csv"
    }
  ];

  /**
   * This function is used to export a PDF.
   * It is called when the button is clicked.
   */
  toggleExportMenu(): void {
    this.isExportToggle = !this.isExportToggle;
    if (this.isExportToggle)
      this.label = "Atrás"
    else
      this.label = "Exportar"
  }

  export(): void {
    this.exportFunction();
    this.isExportToggle = false;
    this.label = "Exportar"
  }
}
