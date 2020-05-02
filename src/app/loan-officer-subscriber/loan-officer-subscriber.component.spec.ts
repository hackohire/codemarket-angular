import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoanOfficerSubscriberComponent } from './loan-officer-subscriber.component';

describe('LoanOfficerSubscriberComponent', () => {
  let component: LoanOfficerSubscriberComponent;
  let fixture: ComponentFixture<LoanOfficerSubscriberComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoanOfficerSubscriberComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoanOfficerSubscriberComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
