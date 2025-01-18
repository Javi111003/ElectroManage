import { Directive, HostListener, Renderer2, ElementRef } from '@angular/core';

@Directive({
  selector: '[appMathValidator]'
})
export class MathValidatorDirective {
  constructor(private renderer: Renderer2, private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInputChange(event: KeyboardEvent): void {
    const input = (event.target as HTMLInputElement).value;
    const sanitizedInput = input.replace(/[^0-9\+\-\*\/\^\s√\.\(\)]/g, '');
    if (sanitizedInput !== input) {
      this.renderer.setProperty(event.target, 'value', sanitizedInput);
    }
  }

  @HostListener('keypress', ['$event'])
  onKeyPress(event: KeyboardEvent): boolean {
    const charCode = event.which ? event.which : event.keyCode;
    const charStr = String.fromCharCode(charCode);
    const allowedCharacters = '0123456789+-*/^√.()';
    if (!allowedCharacters.includes(charStr)) {
      event.preventDefault();
      return false;
    }
    return true;
  }
}
