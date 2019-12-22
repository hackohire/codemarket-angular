import { TestBed } from '@angular/core/testing';

import { AcceleratorService } from './accelerator.service';

describe('MAcceleratorService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AcceleratorService = TestBed.get(AcceleratorService);
    expect(service).toBeTruthy();
  });
});
