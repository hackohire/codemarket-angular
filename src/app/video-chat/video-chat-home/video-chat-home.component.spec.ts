import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VideoChatHomeComponent } from './video-chat-home.component';

describe('VideoChatHomeComponent', () => {
  let component: VideoChatHomeComponent;
  let fixture: ComponentFixture<VideoChatHomeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VideoChatHomeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VideoChatHomeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
