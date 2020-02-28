import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MyRsvpComponent } from './my-rsvp.component';

describe('MyRsvpComponent', () => {
  let component: MyRsvpComponent;
  let fixture: ComponentFixture<MyRsvpComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MyRsvpComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MyRsvpComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
