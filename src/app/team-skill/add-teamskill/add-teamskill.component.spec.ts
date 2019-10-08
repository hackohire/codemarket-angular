import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddTeamskillComponent } from './add-teamskill.component';

describe('AddTeamskillComponent', () => {
  let component: AddTeamskillComponent;
  let fixture: ComponentFixture<AddTeamskillComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddTeamskillComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddTeamskillComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
