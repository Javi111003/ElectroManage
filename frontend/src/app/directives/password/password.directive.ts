import { Directive } from '@angular/core';
import { NG_VALIDATORS, Validator, AbstractControl, ValidationErrors } from '@angular/forms';

@Directive({
  selector: '[appPassword]',
  providers: [
    {
      provide: NG_VALIDATORS,
      useExisting: PasswordValidatorDirective,
      multi: true
    }
  ]
})
// Directive to validate passwords
export class PasswordValidatorDirective implements Validator {
  validate(control: AbstractControl): ValidationErrors | null {
    const password = control.value;

    if (!password)
      return { passwordInvalid: true };

    const minLength = 6;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasDigits = /\d/.test(password);
    const hasNonAlphanumeric = /\W/.test(password);
    const hasMinLength = password.length >= minLength;

    const valid = hasUpperCase && hasDigits && hasNonAlphanumeric && hasMinLength;

    return valid ? null : { passwordInvalid: true };
  }
}

