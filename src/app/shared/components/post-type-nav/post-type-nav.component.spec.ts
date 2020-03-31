import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PostTypeNavComponent } from './post-type-nav.component';

describe('PostTypeNavComponent', () => {
  let component: PostTypeNavComponent;
  let fixture: ComponentFixture<PostTypeNavComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PostTypeNavComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PostTypeNavComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
