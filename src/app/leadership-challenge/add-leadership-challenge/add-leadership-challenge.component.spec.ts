import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddLeadershipChallengeComponent } from './add-leadership-challenge.component';

describe('AddLeadershipChallengeComponent', () => {
  let component: AddLeadershipChallengeComponent;
  let fixture: ComponentFixture<AddLeadershipChallengeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddLeadershipChallengeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddLeadershipChallengeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
