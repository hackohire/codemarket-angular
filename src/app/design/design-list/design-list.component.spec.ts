import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TestingListComponent } from './design-list.component';

describe('TestingListComponent', () => {
  let component: TestingListComponent;
  let fixture: ComponentFixture<TestingListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TestingListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TestingListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
