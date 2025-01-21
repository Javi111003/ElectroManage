import { ComponentFixture, TestBed, fakeAsync, tick, discardPeriodicTasks } from '@angular/core/testing';
import { SnackbarComponent } from './snackbar.component';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

describe('SnackbarComponent', () => {
  let component: SnackbarComponent;
  let fixture: ComponentFixture<SnackbarComponent>;

  const mockSnackBarData = {
    message: 'Test Message'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SnackbarComponent],
      imports: [
        MatProgressBarModule,
        BrowserAnimationsModule
      ],
      providers: [
        { provide: MAT_SNACK_BAR_DATA, useValue: mockSnackBarData }
      ],
      schemas: [CUSTOM_ELEMENTS_SCHEMA]
    }).compileComponents();

    fixture = TestBed.createComponent(SnackbarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should initialize with progress value of 0', () => {
    expect(component.progressValue).toBe(0);
  });

  it('should have correct data injected', () => {
    expect(component.data).toBeTruthy();
    expect(component.data.message).toBe('Test Message');
  });

  it('should start progress on init', () => {
    spyOn(component, 'startProgress');
    component.ngOnInit();
    expect(component.startProgress).toHaveBeenCalled();
  });

  it('should increment progress value over time', fakeAsync(() => {
    component.startProgress();
    
    tick(1000); // Avanzar 1 segundo
    expect(component.progressValue).toBeGreaterThan(0);
    
    tick(2000); // Avanzar 2 segundos más
    expect(component.progressValue).toBe(100);
    
    discardPeriodicTasks(); // Limpiar los intervalos pendientes
  }));

  it('should clear interval when progress reaches 100', fakeAsync(() => {
    component.startProgress();
    tick(3000); // Esperar a que termine la animación
    
    expect(component.progressValue).toBe(100);
    expect(component.intervalId).toBeDefined();
    
    const initialIntervalId = component.intervalId;
    tick(1000); // Esperar un segundo más
    
    expect(component.progressValue).toBe(100); // No debería seguir incrementando
    expect(component.intervalId).toBe(initialIntervalId);
    
    discardPeriodicTasks();
  }));

  it('should calculate correct interval based on duration', fakeAsync(() => {
    const duration = 3000;
    const expectedInterval = duration / 100; // 30ms por incremento
    
    component.startProgress();
    tick(expectedInterval);
    
    expect(component.progressValue).toBe(1); // Debería incrementar 1 después de un intervalo
    
    discardPeriodicTasks();
  }));

  afterEach(() => {
    if (component.intervalId) {
      clearInterval(component.intervalId);
    }
  });
});
