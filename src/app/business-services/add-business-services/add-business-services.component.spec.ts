import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBusinessServicesComponent } from './add-business-services.component';

describe('AddBusinessServicesComponent', () => {
  let component: AddBusinessServicesComponent;
  let fixture: ComponentFixture<AddBusinessServicesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBusinessServicesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBusinessServicesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
