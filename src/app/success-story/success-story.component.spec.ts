import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SuccessStoryComponent } from './success-story.component';

describe('SuccessStoryComponent', () => {
  let component: SuccessStoryComponent;
  let fixture: ComponentFixture<SuccessStoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SuccessStoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SuccessStoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
