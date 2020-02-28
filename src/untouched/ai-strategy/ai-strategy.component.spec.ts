import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AiStrategyComponent } from './ai-strategy.component';

describe('AiStrategyComponent', () => {
  let component: AiStrategyComponent;
  let fixture: ComponentFixture<AiStrategyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AiStrategyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AiStrategyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
