import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddHiringProcessComponent } from './add-hiring-process.component';

describe('AddHiringProcessComponent', () => {
  let component: AddHiringProcessComponent;
  let fixture: ComponentFixture<AddHiringProcessComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddHiringProcessComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddHiringProcessComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
