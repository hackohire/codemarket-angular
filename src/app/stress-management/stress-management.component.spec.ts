import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { StressManagementComponent } from './stress-management.component';

describe('StressManagementComponent', () => {
  let component: StressManagementComponent;
  let fixture: ComponentFixture<StressManagementComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ StressManagementComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(StressManagementComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
