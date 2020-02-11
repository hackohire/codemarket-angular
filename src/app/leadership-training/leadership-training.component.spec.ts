import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LeadershipTrainingComponent } from './leadership-training.component';

describe('LeadershipTrainingComponent', () => {
  let component: LeadershipTrainingComponent;
  let fixture: ComponentFixture<LeadershipTrainingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LeadershipTrainingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LeadershipTrainingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
