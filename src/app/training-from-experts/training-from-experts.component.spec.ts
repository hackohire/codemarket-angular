import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TrainingFromExpertsComponent } from './training-from-experts.component';

describe('TrainingFromExpertsComponent', () => {
  let component: TrainingFromExpertsComponent;
  let fixture: ComponentFixture<TrainingFromExpertsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TrainingFromExpertsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TrainingFromExpertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
