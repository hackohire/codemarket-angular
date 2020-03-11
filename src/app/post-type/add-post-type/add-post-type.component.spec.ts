import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPostTypeComponent } from './add-post-type.component';

describe('AddPostTypeComponent', () => {
  let component: AddPostTypeComponent;
  let fixture: ComponentFixture<AddPostTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPostTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPostTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
