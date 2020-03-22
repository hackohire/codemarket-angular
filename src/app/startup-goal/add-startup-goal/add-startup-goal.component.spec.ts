import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStartupGoalComponent } from './add-startup-goal.component';

describe('AddStartupGoalComponent', () => {
  let component: AddStartupGoalComponent;
  let fixture: ComponentFixture<AddStartupGoalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddStartupGoalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStartupGoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
