import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBusinessChallengeComponent } from './add-business-challenge.component';

describe('AddBusinessChallengeComponent', () => {
  let component: AddBusinessChallengeComponent;
  let fixture: ComponentFixture<AddBusinessChallengeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBusinessChallengeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBusinessChallengeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
