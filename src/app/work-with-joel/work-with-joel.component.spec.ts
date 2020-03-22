import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { WorkWithJoelComponent } from './work-with-joel.component';

describe('WorkWithJoelComponent', () => {
  let component: WorkWithJoelComponent;
  let fixture: ComponentFixture<WorkWithJoelComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ WorkWithJoelComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(WorkWithJoelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
