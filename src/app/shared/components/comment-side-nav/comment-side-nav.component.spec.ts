import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentSideNavComponent } from './comment-side-nav.component';

describe('CommentSideNavComponent', () => {
  let component: CommentSideNavComponent;
  let fixture: ComponentFixture<CommentSideNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CommentSideNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentSideNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
