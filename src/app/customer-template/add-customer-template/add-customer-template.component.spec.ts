import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCustomerTemplateComponent } from './add-customer-template.component';

describe('AddCustomerTemplateComponent', () => {
  let component: AddCustomerTemplateComponent;
  let fixture: ComponentFixture<AddCustomerTemplateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCustomerTemplateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCustomerTemplateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
