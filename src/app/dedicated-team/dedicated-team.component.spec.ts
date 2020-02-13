import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DedicatedTeamComponent } from './dedicated-team.component';

describe('DedicatedTeamComponent', () => {
  let component: DedicatedTeamComponent;
  let fixture: ComponentFixture<DedicatedTeamComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DedicatedTeamComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DedicatedTeamComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
