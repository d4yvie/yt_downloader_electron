import { TestBed } from '@angular/core/testing';

import { YoutubeDownloadService } from './youtube-download.service';

describe('YoutubeDownloadService', () => {
  let service: YoutubeDownloadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(YoutubeDownloadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
