import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHowtodocComponent } from './add-howtodoc.component';

describe('AddHowtodocComponent', () => {
  let component: AddHowtodocComponent;
  let fixture: ComponentFixture<AddHowtodocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddHowtodocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHowtodocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
