import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DialogComponent } from './dialog.component';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('DialogComponent', () => {
  let component: DialogComponent;
  let fixture: ComponentFixture<DialogComponent>;
  let dialogRefMock: jasmine.SpyObj<MatDialogRef<DialogComponent>>;

  const mockDialogData = {
    message: 'Test Message',
    showConfirmButton: true
  };

  beforeEach(async () => {
    dialogRefMock = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      declarations: [DialogComponent],
      imports: [
        MatDialogModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefMock },
        { provide: MAT_DIALOG_DATA, useValue: mockDialogData }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(DialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
  
  it('should close dialog with true on confirm', () => {
    component.onConfirm();
    expect(dialogRefMock.close).toHaveBeenCalledWith(true);
  });

  it('should close dialog with false on cancel', () => {
    component.onCancel();
    expect(dialogRefMock.close).toHaveBeenCalledWith(false);
  });

  it('should not render confirm button when showConfirmButton is false', () => {
    component.data.showConfirmButton = false;
    fixture.detectChanges();
    
    const confirmButton = fixture.debugElement.nativeElement.querySelector('.confirm-button');
    expect(confirmButton).toBeFalsy();
  });

  afterEach(() => {
    // Cleanup
  });
});
