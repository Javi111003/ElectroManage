import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { ChipsComponent } from './chips.component';
import { MatChipsModule } from '@angular/material/chips';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatChipInputEvent } from '@angular/material/chips';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';
import { signal } from '@angular/core';
import { FormsModule } from '@angular/forms';

describe('ChipsComponent', () => {
  let component: ChipsComponent;
  let fixture: ComponentFixture<ChipsComponent>;

  const mockOptions = [
    { id: 1, name: 'Option 1' },
    { id: 2, name: 'Option 2' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ChipsComponent],
      imports: [
        MatChipsModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        BrowserAnimationsModule,
        FormsModule  // Añadir este módulo
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(ChipsComponent);
    component = fixture.componentInstance;
    component.options = signal(mockOptions);
    component.allOptions = [...mockOptions];
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    expect(component.label).toBe('');
    expect(component.variable).toBeTrue();
    expect(component.options()).toEqual(mockOptions);
    expect(component.allOptions).toEqual(mockOptions);
  });

  it('should not add duplicate option', () => {
    const event = {
      value: 'Option 1',
      input: document.createElement('input')
    } as MatChipInputEvent;

    component.add(event);

    expect(component.options().length).toBe(2); // Corregir el paréntesis faltante
  });

  it('should remove option', () => {
    const initialLength = component.options().length;
    const optionToRemove = mockOptions[0];
    
    component.remove(optionToRemove);

    const remainingOptions = component.options();
    expect(remainingOptions.length).toBe(initialLength - 1);
    expect(remainingOptions.find(opt => opt.id === optionToRemove.id)).toBeUndefined();
  });

  it('should handle autocomplete selection', () => {
    const event = {
      option: {
        deselect: jasmine.createSpy('deselect')
      }
    } as any as MatAutocompleteSelectedEvent;

    component.selectedOption(event);

    expect(event.option.deselect).toHaveBeenCalled();
  });

  it('should handle option action', () => {
    const functionSpy = spyOn(component, 'function');
    const option = mockOptions[0];

    component.action(option);

    expect(functionSpy).toHaveBeenCalledWith(option);
  });

  it('should remove option from allOptions', () => {
    const option = mockOptions[0];
    const initialAllOptionsLength = component.allOptions.length;
    const initialOptionsLength = component.options().length;
    const deleteOptionSpy = spyOn(component, 'deleteOption');

    component.removeOption(option);

    expect(component.allOptions.length).toBe(initialAllOptionsLength - 1);
    expect(component.options().length).toBe(initialOptionsLength - 1);
    expect(deleteOptionSpy).toHaveBeenCalledWith(option);
  });
  
  afterEach(() => {
    // Cleanup
  });
});
