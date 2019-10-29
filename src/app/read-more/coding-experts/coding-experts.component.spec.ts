import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CodingExpertsComponent } from './coding-experts.component';

describe('CodingExpertsComponent', () => {
  let component: CodingExpertsComponent;
  let fixture: ComponentFixture<CodingExpertsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CodingExpertsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CodingExpertsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
