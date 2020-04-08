import { TestBed } from '@angular/core/testing';

import { AddHomeworkService } from './add-homework.service';

describe('AddHomeworkService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: AddHomeworkService = TestBed.get(AddHomeworkService);
    expect(service).toBeTruthy();
  });
});
