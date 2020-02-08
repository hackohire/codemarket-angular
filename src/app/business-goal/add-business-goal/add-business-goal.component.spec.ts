import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBusinessGoalComponent } from './add-business-goal.component';

describe('AddBusinessGoalComponent', () => {
  let component: AddBusinessGoalComponent;
  let fixture: ComponentFixture<AddBusinessGoalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBusinessGoalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBusinessGoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
