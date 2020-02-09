import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSocialImpactGoalComponent } from './add-social-impact-goal.component';

describe('AddSocialImpactGoalComponent', () => {
  let component: AddSocialImpactGoalComponent;
  let fixture: ComponentFixture<AddSocialImpactGoalComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSocialImpactGoalComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSocialImpactGoalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
