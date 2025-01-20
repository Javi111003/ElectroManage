import { MathValidatorDirective } from './math-validator.directive';

describe('MathValidatorDirective', () => {
  it('should create an instance', () => {
    const directive = new MathValidatorDirective([][0], [][0]);
    expect(directive).toBeTruthy();
  });
});
