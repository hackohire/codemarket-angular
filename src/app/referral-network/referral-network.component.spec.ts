import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReferralNetworkComponent } from './referral-network.component';

describe('ReferralNetworkComponent', () => {
  let component: ReferralNetworkComponent;
  let fixture: ComponentFixture<ReferralNetworkComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReferralNetworkComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReferralNetworkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
