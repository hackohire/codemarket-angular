import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DprComponent } from './dpr.component';

describe('DprComponent', () => {
  let component: DprComponent;
  let fixture: ComponentFixture<DprComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DprComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DprComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
