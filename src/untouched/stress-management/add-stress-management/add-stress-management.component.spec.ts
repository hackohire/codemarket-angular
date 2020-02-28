import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddStressManagementComponent } from './add-stress-management.component';

describe('AddStressManagementComponent', () => {
  let component: AddStressManagementComponent;
  let fixture: ComponentFixture<AddStressManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddStressManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddStressManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
