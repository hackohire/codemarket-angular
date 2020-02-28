import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddPostMenuComponent } from './add-post-menu.component';

describe('AddPostMenuComponent', () => {
  let component: AddPostMenuComponent;
  let fixture: ComponentFixture<AddPostMenuComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddPostMenuComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddPostMenuComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
