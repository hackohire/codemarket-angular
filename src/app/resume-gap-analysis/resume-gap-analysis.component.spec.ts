import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumeGapAnalysisComponent } from './resume-gap-analysis.component';

describe('ResumeGapAnalysisComponent', () => {
  let component: ResumeGapAnalysisComponent;
  let fixture: ComponentFixture<ResumeGapAnalysisComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumeGapAnalysisComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumeGapAnalysisComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
