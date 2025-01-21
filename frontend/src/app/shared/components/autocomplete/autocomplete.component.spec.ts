import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { AutocompleteComponent } from './autocomplete.component';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { Item } from '../../shared.module';

describe('AutocompleteComponent', () => {
  let component: AutocompleteComponent;
  let fixture: ComponentFixture<AutocompleteComponent>;

  const mockOptions: Item[] = [
    { id: 1, name: 'Test Option 1' },
    { id: 2, name: 'Test Option 2' },
    { id: 3, name: 'Different Option' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AutocompleteComponent],
      imports: [
        ReactiveFormsModule,
        MatAutocompleteModule,
        MatFormFieldModule,
        MatInputModule,
        BrowserAnimationsModule
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(AutocompleteComponent);
    component = fixture.componentInstance;
    component.options = [...mockOptions];
    component.control = new FormControl();
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with default values', () => {
    const newComponent = new AutocompleteComponent();
    expect(newComponent.label).toBe('');
    expect(newComponent.options).toEqual([]);
    expect(newComponent.isDisabled).toBeFalse();
    expect(newComponent.showIcon).toBeFalse();
  });

  it('should filter options correctly', fakeAsync(() => {
    component.control.setValue('Test');
    tick();
    
    component.filteredOptions.subscribe(filtered => {
      expect(filtered.length).toBe(2);
      expect(filtered.every(option => option.name.includes('Test'))).toBeTrue();
    });
  }));

  it('should handle empty filter value', fakeAsync(() => {
    component.control.setValue('');
    tick();
    
    component.filteredOptions.subscribe(filtered => {
      expect(filtered).toEqual(mockOptions);
    });
  }));

  it('should remove option correctly', () => {
    const optionToRemove = mockOptions[0];
    const deleteOptionSpy = spyOn(component, 'deleteOption');
    
    component.removeOption(optionToRemove);
    
    expect(component.options.length).toBe(mockOptions.length - 1);
    expect(component.options.includes(optionToRemove)).toBeFalse();
    expect(deleteOptionSpy).toHaveBeenCalledWith(optionToRemove);
  });

  it('should display option name correctly', () => {
    const testOption: Item = { id: 1, name: 'Test Option' };
    expect(component.displayFn(testOption)).toBe('Test Option');
  });

  it('should handle null option in displayFn', () => {
    expect(component.displayFn(null as any)).toBe('');
  });

  it('should update filtered options when options input changes', fakeAsync(() => {
    const newOptions = [{ id: 4, name: 'New Option' }];
    component.options = newOptions;
    component.ngOnChanges({
      options: {
        currentValue: newOptions,
        previousValue: mockOptions,
        firstChange: false,
        isFirstChange: () => false
      }
    });
    tick();

    component.control.setValue('New');
    tick();
    
    component.filteredOptions.subscribe(filtered => {
      expect(filtered.length).toBe(1);
      expect(filtered[0].name).toBe('New Option');
    });
  }));

  afterEach(() => {
    // Cleanup
  });
});
