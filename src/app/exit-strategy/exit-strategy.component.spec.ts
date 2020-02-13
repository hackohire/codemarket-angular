import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExitStrategyComponent } from './exit-strategy.component';

describe('ExitStrategyComponent', () => {
  let component: ExitStrategyComponent;
  let fixture: ComponentFixture<ExitStrategyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExitStrategyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExitStrategyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
