import { Directive, ElementRef, HostListener } from '@angular/core';
import { NgControl } from '@angular/forms';

@Directive({
  selector: '[appNumberValidation]'
})

export class NumberValidationDirective {

  constructor(
    private ngControl: NgControl,
    private el: ElementRef
  ) { }

  @HostListener('input', ['$event'])
  onInputChange(event: KeyboardEvent): void {
    const input = (this.el.nativeElement as HTMLInputElement).value;

    const sanitizedInput = input.replace(/[^0-9]/g, '');
    this.ngControl.control!.setValue(sanitizedInput);
  }

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    console.log("hola");
    if (charCode > 31 && (charCode < 48 || charCode > 57)) {
      event.preventDefault();
      return false;
    }
    return true;
  }
}

