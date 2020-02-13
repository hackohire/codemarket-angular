import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { InnovateComponent } from './innovate.component';

describe('InnovateComponent', () => {
  let component: InnovateComponent;
  let fixture: ComponentFixture<InnovateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ InnovateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InnovateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
