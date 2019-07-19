import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SellingProductsComponent } from './selling-products.component';

describe('SellingProductsComponent', () => {
  let component: SellingProductsComponent;
  let fixture: ComponentFixture<SellingProductsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SellingProductsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SellingProductsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
