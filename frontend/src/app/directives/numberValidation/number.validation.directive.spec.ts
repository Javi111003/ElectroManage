import { NumberValidationDirective } from './number.validation.directive';

describe('NumberValidationDirective', () => {
  it('should create an instance', () => {
    const mockNgControl = jasmine.createSpyObj('NgControl', ['control', 'valueAccessor']);
    const directive = new NumberValidationDirective(mockNgControl);
    expect(directive).toBeTruthy();
  });
});
