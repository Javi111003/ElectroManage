import { Directive, HostListener, Renderer2, ElementRef } from '@angular/core';

@Directive({
  selector: '[appMathValidator]'
})
// Directive to validate inputs which need math operators and numbers
export class MathValidatorDirective {
  constructor(private renderer: Renderer2, private el: ElementRef) {}

  @HostListener('input', ['$event'])
  onInputChange(event: KeyboardEvent): void {
    const input = (event.target as HTMLInputElement).value;
    let sanitizedInput = input.replace(/[^0-9\+\-\*\/\^\s√\.\(\)]/g, '');
    const parts = sanitizedInput.split('.');

    if (parts.length > 2) {
      sanitizedInput = `${parts[0]}.${parts.slice(1).join('')}`;
    }

    if (sanitizedInput.startsWith('.')) {
      sanitizedInput = `0${sanitizedInput}`;
    }

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

    const input = (event.target as HTMLInputElement).value;
    if (charStr === '.' && (input.includes('.') || input === '')) {
      event.preventDefault();
      return false;
    }

    return true;
  }
}

