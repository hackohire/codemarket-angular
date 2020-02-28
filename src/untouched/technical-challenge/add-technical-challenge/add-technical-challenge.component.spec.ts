import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTechnicalChallengeComponent } from './add-technical-challenge.component';

describe('AddTechnicalChallengeComponent', () => {
  let component: AddTechnicalChallengeComponent;
  let fixture: ComponentFixture<AddTechnicalChallengeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTechnicalChallengeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTechnicalChallengeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
