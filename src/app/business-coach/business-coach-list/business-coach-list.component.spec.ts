import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BusinessCoachListComponent } from './business-coach-list.component';

describe('BusinessCoachListComponent', () => {
  let component: BusinessCoachListComponent;
  let fixture: ComponentFixture<BusinessCoachListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BusinessCoachListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BusinessCoachListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
