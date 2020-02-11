import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommunityImpactStoriesComponent } from './community-impact-stories.component';

describe('CommunityImpactStoriesComponent', () => {
  let component: CommunityImpactStoriesComponent;
  let fixture: ComponentFixture<CommunityImpactStoriesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommunityImpactStoriesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommunityImpactStoriesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
