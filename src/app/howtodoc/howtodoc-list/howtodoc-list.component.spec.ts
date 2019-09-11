import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { HowtodocListComponent } from './howtodoc-list.component';

describe('HowtodocListComponent', () => {
  let component: HowtodocListComponent;
  let fixture: ComponentFixture<HowtodocListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ HowtodocListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(HowtodocListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
