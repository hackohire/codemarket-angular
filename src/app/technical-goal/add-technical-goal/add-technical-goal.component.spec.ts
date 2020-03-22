import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTechnicalGoalComponent } from './add-technical-goal.component';

describe('AddTechnicalGoalComponent', () => {
  let component: AddTechnicalGoalComponent;
  let fixture: ComponentFixture<AddTechnicalGoalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTechnicalGoalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTechnicalGoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
