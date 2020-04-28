import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewFormDataListComponent } from './view-form-data-list.component';

describe('ViewFormDataListComponent', () => {
  let component: ViewFormDataListComponent;
  let fixture: ComponentFixture<ViewFormDataListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewFormDataListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewFormDataListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
