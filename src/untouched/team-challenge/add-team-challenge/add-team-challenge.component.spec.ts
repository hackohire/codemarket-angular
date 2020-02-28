import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTeamChallengeComponent } from './add-team-challenge.component';

describe('AddTeamChallengeComponent', () => {
  let component: AddTeamChallengeComponent;
  let fixture: ComponentFixture<AddTeamChallengeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTeamChallengeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTeamChallengeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
