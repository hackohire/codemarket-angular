import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddMarketingChallengeComponent } from './add-marketing-challenge.component';

describe('AddMarketingChallengeComponent', () => {
  let component: AddMarketingChallengeComponent;
  let fixture: ComponentFixture<AddMarketingChallengeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddMarketingChallengeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddMarketingChallengeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
