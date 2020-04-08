import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakemoneylistComponent } from './makemoneylist.component';

describe('MakemoneylistComponent', () => {
  let component: MakemoneylistComponent;
  let fixture: ComponentFixture<MakemoneylistComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakemoneylistComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakemoneylistComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
