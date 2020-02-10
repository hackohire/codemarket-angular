import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RealProjectsComponent } from './real-projects.component';

describe('RealProjectsComponent', () => {
  let component: RealProjectsComponent;
  let fixture: ComponentFixture<RealProjectsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RealProjectsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RealProjectsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
