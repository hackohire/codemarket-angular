import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddAssigneeComponent } from './add-assignee.component';

describe('AddAssigneeComponent', () => {
  let component: AddAssigneeComponent;
  let fixture: ComponentFixture<AddAssigneeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddAssigneeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddAssigneeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
