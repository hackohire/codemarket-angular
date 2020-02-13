import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SalesGrowthStrategyComponent } from './sales-growth-strategy.component';

describe('SalesGrowthStrategyComponent', () => {
  let component: SalesGrowthStrategyComponent;
  let fixture: ComponentFixture<SalesGrowthStrategyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SalesGrowthStrategyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SalesGrowthStrategyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
