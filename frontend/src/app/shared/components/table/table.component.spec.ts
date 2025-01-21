import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { TableComponent, ConfigColumn } from './table.component';
import { MatTableDataSource } from '@angular/material/table';
import { MatPaginatorModule, MatPaginatorIntl } from '@angular/material/paginator';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { MatTableModule } from '@angular/material/table';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { MatTooltipModule } from '@angular/material/tooltip';

describe('TableComponent', () => {
  let component: TableComponent;
  let fixture: ComponentFixture<TableComponent>;

  const mockColumns: ConfigColumn[] = [
    { title: 'Test Title 1', field: 'field1' },
    { title: 'Test Title 2', field: 'field2' }
  ];

  const mockData = [
    { field1: 'Value 1', field2: 'Short Value' },
    { field1: 'Value 2', field2: 'A very long value that should be truncated when displayed in the table cell because it exceeds the maximum length' }
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TableComponent],
      imports: [
        MatTableModule,
        MatPaginatorModule,
        BrowserAnimationsModule,
        MatTooltipModule  // Añadir este módulo
      ],
      providers: [
        MatPaginatorIntl
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(TableComponent);
    component = fixture.componentInstance;
    
    component.displayedColumns = mockColumns;
    component.dataSource = new MatTableDataSource(mockData);
    
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize table with correct columns', () => {
    component.ngOnInit();
    expect(component.headings.length).toBe(2);
    expect(component.headings).toEqual(['field1', 'field2']);
  });

  it('should add action columns when showActions is true', () => {
    component.showActions = true;
    component.ngOnInit();
    
    expect(component.headings.length).toBe(4);
    expect(component.headings).toContain('editColumn');
    expect(component.headings).toContain('deleteColumn');
  });

  it('should initialize paginator after view init', fakeAsync(() => {
    component.ngAfterViewInit();
    tick();
    
    expect(component.dataSource.paginator).toBeTruthy();
  }));

  it('should truncate long strings in printCell', () => {
    const longString = mockData[1].field2;
    const truncated = component.printCell(longString);
    
    expect(truncated.length).toBeLessThan(longString.length);
    expect(truncated.endsWith('...')).toBeTrue();
  });

  it('should not truncate short strings in printCell', () => {
    const shortString = mockData[0].field2;
    const result = component.printCell(shortString);
    
    expect(result).toBe(shortString);
    expect(result.endsWith('...')).toBeFalse();
  });

  it('should return non-string values unchanged in printCell', () => {
    const numberValue = 42;
    const result = component.printCell(numberValue);
    
    expect(result).toBe(numberValue);
  });

  it('should generate tooltip for long strings', () => {
    const longString = mockData[1].field2;
    const tooltip = component.printTooltip(longString);
    
    expect(tooltip).toBe(longString);
  });

  it('should not generate tooltip for short strings', () => {
    const shortString = mockData[0].field2;
    const tooltip = component.printTooltip(shortString);
    
    expect(tooltip).toBe('');
  });

  it('should not generate tooltip for non-string values', () => {
    const numberValue = 42;
    const tooltip = component.printTooltip(numberValue);
    
    expect(tooltip).toBe('');
  });

  it('should handle delete function', () => {
    const mockDeleteFn = jasmine.createSpy('deleteFunction');
    component.deleteFunction = mockDeleteFn;
    const testItem = { id: 1 };
    
    component.deleteFunction(testItem);
    expect(mockDeleteFn).toHaveBeenCalledWith(testItem);
  });

  it('should handle edit function', () => {
    const mockEditFn = jasmine.createSpy('editFunction');
    component.editFunction = mockEditFn;
    const testItem = { id: 1 };
    
    component.editFunction(testItem);
    expect(mockEditFn).toHaveBeenCalledWith(testItem);
  });

  afterEach(() => {
    // Cleanup
  });
});
