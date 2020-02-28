import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleCartProductComponent } from './single-cart-product.component';

describe('SingleCartProductComponent', () => {
  let component: SingleCartProductComponent;
  let fixture: ComponentFixture<SingleCartProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SingleCartProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SingleCartProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
