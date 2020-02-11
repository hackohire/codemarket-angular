import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { GetWorkDoneComponent } from './get-work-done.component';

describe('GetWorkDoneComponent', () => {
  let component: GetWorkDoneComponent;
  let fixture: ComponentFixture<GetWorkDoneComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ GetWorkDoneComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(GetWorkDoneComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
