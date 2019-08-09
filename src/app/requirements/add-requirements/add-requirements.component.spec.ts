import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddRequirementsComponent } from './add-requirements.component';

describe('AddRequirementsComponent', () => {
  let component: AddRequirementsComponent;
  let fixture: ComponentFixture<AddRequirementsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddRequirementsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddRequirementsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
