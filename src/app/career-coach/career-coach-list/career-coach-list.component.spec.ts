import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CareerCoachListComponent } from './career-coach-list.component';

describe('CareerCoachListComponent', () => {
  let component: CareerCoachListComponent;
  let fixture: ComponentFixture<CareerCoachListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CareerCoachListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CareerCoachListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
