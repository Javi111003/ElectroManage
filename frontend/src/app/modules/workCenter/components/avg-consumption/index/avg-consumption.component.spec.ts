import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AvgConsumptionComponent } from './avg-consumption.component';

describe('AvgConsumptionComponent', () => {
  let component: AvgConsumptionComponent;
  let fixture: ComponentFixture<AvgConsumptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AvgConsumptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AvgConsumptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
