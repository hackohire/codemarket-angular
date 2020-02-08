import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddSalesChallengeComponent } from './add-sales-challenge.component';

describe('AddSalesChallengeComponent', () => {
  let component: AddSalesChallengeComponent;
  let fixture: ComponentFixture<AddSalesChallengeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddSalesChallengeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddSalesChallengeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
