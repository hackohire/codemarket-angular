import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddBusinessCoachComponent } from './add-business-coach.component';

describe('AddBusinessCoachComponent', () => {
  let component: AddBusinessCoachComponent;
  let fixture: ComponentFixture<AddBusinessCoachComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddBusinessCoachComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddBusinessCoachComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
