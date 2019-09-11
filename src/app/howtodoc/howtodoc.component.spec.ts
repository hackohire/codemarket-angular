import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HowtodocComponent } from './howtodoc.component';

describe('HowtodocComponent', () => {
  let component: HowtodocComponent;
  let fixture: ComponentFixture<HowtodocComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HowtodocComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HowtodocComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
