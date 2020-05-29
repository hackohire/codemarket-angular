import { TestBed } from '@angular/core/testing';

import { MakemoneyonlineService } from './makemoneyonline.service';

describe('MakemoneyonlineService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MakemoneyonlineService = TestBed.get(MakemoneyonlineService);
    expect(service).toBeTruthy();
  });
});
