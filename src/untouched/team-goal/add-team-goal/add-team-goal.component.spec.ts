import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTeamGoalComponent } from './add-team-goal.component';

describe('AddTeamGoalComponent', () => {
  let component: AddTeamGoalComponent;
  let fixture: ComponentFixture<AddTeamGoalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTeamGoalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTeamGoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
