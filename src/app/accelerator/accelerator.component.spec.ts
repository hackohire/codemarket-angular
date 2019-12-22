import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AcceleratorComponent } from './accelerator.component';

describe('AcceleratorComponent', () => {
  let component: AcceleratorComponent;
  let fixture: ComponentFixture<AcceleratorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AcceleratorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AcceleratorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
