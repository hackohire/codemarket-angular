import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DownPaymentHelpComponent } from './down-payment-help.component';

describe('DownPaymentHelpComponent', () => {
  let component: DownPaymentHelpComponent;
  let fixture: ComponentFixture<DownPaymentHelpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DownPaymentHelpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DownPaymentHelpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
