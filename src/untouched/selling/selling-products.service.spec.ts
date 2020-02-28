import { TestBed } from '@angular/core/testing';

import { SellingProductsService } from './selling-products.service';

describe('SellingProductsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SellingProductsService = TestBed.get(SellingProductsService);
    expect(service).toBeTruthy();
  });
});
