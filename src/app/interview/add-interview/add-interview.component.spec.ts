import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddInterviewComponent } from './add-interview.component';

describe('AddInterviewComponent', () => {
  let component: AddInterviewComponent;
  let fixture: ComponentFixture<AddInterviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddInterviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddInterviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
