import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DreamJobMentorsComponent } from './dream-job-mentors.component';

describe('DreamJobMentorsComponent', () => {
  let component: DreamJobMentorsComponent;
  let fixture: ComponentFixture<DreamJobMentorsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DreamJobMentorsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DreamJobMentorsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
