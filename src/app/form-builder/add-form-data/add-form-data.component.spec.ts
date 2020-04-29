import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddFormDataComponent } from './add-form-data.component';

describe('AddFormDataComponent', () => {
  let component: AddFormDataComponent;
  let fixture: ComponentFixture<AddFormDataComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddFormDataComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddFormDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
