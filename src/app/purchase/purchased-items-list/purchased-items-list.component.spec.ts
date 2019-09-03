import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PurchasedItemsListComponent } from './purchased-items-list.component';

describe('PurchasedItemsListComponent', () => {
  let component: PurchasedItemsListComponent;
  let fixture: ComponentFixture<PurchasedItemsListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PurchasedItemsListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PurchasedItemsListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
