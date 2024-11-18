import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TotalConsumptionComponent } from './total-consumption.component';

describe('TotalConsumptionComponent', () => {
  let component: TotalConsumptionComponent;
  let fixture: ComponentFixture<TotalConsumptionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TotalConsumptionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TotalConsumptionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
