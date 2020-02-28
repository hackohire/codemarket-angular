import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCareerCoachComponent } from './add-career-coach.component';

describe('AddCareerCoachComponent', () => {
  let component: AddCareerCoachComponent;
  let fixture: ComponentFixture<AddCareerCoachComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCareerCoachComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCareerCoachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
