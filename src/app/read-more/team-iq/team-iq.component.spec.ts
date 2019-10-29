import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TeamIqComponent } from './team-iq.component';

describe('TeamIqComponent', () => {
  let component: TeamIqComponent;
  let fixture: ComponentFixture<TeamIqComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TeamIqComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TeamIqComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
