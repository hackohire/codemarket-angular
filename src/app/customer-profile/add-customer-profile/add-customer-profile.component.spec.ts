import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomerProfileComponent } from './add-customer-profile.component';

describe('AddCustomerProfileComponent', () => {
  let component: AddCustomerProfileComponent;
  let fixture: ComponentFixture<AddCustomerProfileComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCustomerProfileComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCustomerProfileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
