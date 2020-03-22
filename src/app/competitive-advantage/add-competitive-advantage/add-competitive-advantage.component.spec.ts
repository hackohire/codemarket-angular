import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCompetitiveAdvantageComponent } from './add-competitive-advantage.component';

describe('AddCompetitiveAdvantageComponent', () => {
  let component: AddCompetitiveAdvantageComponent;
  let fixture: ComponentFixture<AddCompetitiveAdvantageComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCompetitiveAdvantageComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCompetitiveAdvantageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
