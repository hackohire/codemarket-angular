import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCompanyPostComponent } from './add-company-post.component';

describe('AddCompanyPostComponent', () => {
  let component: AddCompanyPostComponent;
  let fixture: ComponentFixture<AddCompanyPostComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCompanyPostComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCompanyPostComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
