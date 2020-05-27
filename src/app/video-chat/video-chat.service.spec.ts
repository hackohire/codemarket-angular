import { TestBed } from '@angular/core/testing';

import { VideoChatService } from './video-chat.service';

describe('VideoChatService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VideoChatService = TestBed.get(VideoChatService);
    expect(service).toBeTruthy();
  });
});
