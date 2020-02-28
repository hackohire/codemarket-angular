import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTestingComponent } from './add-testing.component';

describe('AddTestingComponent', () => {
  let component: AddTestingComponent;
  let fixture: ComponentFixture<AddTestingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTestingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTestingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
