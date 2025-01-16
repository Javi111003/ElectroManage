import { TestBed } from '@angular/core/testing';
import { MatSnackBar } from '@angular/material/snack-bar';
import { SnackbarService } from './snackbar.service';
import { SnackbarComponent } from '../../shared/components/snackbar/snackbar.component';

describe('SnackbarService', () => {
  let service: SnackbarService;
  let snackBar: jasmine.SpyObj<MatSnackBar>;

  beforeEach(() => {
    const spy = jasmine.createSpyObj('MatSnackBar', ['openFromComponent']);
    TestBed.configureTestingModule({
      providers: [
        SnackbarService,
        { provide: MatSnackBar, useValue: spy }
      ]
    });
    service = TestBed.inject(SnackbarService);
    snackBar = TestBed.inject(MatSnackBar) as jasmine.SpyObj<MatSnackBar>;
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('openSnackBar', () => {
    it('should open snackbar with default duration', () => {
      const testMessage = 'Test message';
      
      service.openSnackBar(testMessage);

      expect(snackBar.openFromComponent).toHaveBeenCalledWith(
        SnackbarComponent,
        {
          data: { message: testMessage },
          duration: 3000,
          verticalPosition: 'bottom',
          horizontalPosition: 'right'
        }
      );
    });

    it('should open snackbar with custom duration', () => {
      const testMessage = 'Test message';
      const customDuration = 5000;
      
      service.openSnackBar(testMessage, customDuration);

      expect(snackBar.openFromComponent).toHaveBeenCalledWith(
        SnackbarComponent,
        {
          data: { message: testMessage },
          duration: customDuration,
          verticalPosition: 'bottom',
          horizontalPosition: 'right'
        }
      );
    });
  });
});
