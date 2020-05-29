import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MakemoneyonlineComponent } from './makemoneyonline.component';

describe('MakemoneyonlineComponent', () => {
  let component: MakemoneyonlineComponent;
  let fixture: ComponentFixture<MakemoneyonlineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MakemoneyonlineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MakemoneyonlineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
