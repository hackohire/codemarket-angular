import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BannerbankComponent } from './bannerbank.component';

describe('BannerbankComponent', () => {
  let component: BannerbankComponent;
  let fixture: ComponentFixture<BannerbankComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BannerbankComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BannerbankComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
