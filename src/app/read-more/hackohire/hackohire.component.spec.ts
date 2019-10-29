import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HackohireComponent } from './hackohire.component';

describe('HackohireComponent', () => {
  let component: HackohireComponent;
  let fixture: ComponentFixture<HackohireComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HackohireComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HackohireComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
