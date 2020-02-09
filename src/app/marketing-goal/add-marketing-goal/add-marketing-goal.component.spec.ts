import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMarketingGoalComponent } from './add-marketing-goal.component';

describe('AddMarketingGoalComponent', () => {
  let component: AddMarketingGoalComponent;
  let fixture: ComponentFixture<AddMarketingGoalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMarketingGoalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMarketingGoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
