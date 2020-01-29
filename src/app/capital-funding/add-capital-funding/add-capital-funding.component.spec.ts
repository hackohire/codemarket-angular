import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddCapitalFundingComponent } from './add-capital-funding.component';

describe('AddCapitalFundingComponent', () => {
  let component: AddCapitalFundingComponent;
  let fixture: ComponentFixture<AddCapitalFundingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddCapitalFundingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddCapitalFundingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
