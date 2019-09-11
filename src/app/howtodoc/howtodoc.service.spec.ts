import { TestBed } from '@angular/core/testing';

import { HowtodocService } from './howtodoc.service';

describe('HowtodocService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HowtodocService = TestBed.get(HowtodocService);
    expect(service).toBeTruthy();
  });
});
