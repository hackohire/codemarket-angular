import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DreamJobDetailsComponent } from './dream-job-details.component';

describe('DreamJobDetailsComponent', () => {
  let component: DreamJobDetailsComponent;
  let fixture: ComponentFixture<DreamJobDetailsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DreamJobDetailsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DreamJobDetailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
