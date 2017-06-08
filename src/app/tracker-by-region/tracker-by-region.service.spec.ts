/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TrackerByRegionService } from './tracker-by-region.service';

describe('TrackerByRegionService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrackerByRegionService]
    });
  });

  it('should ...', inject([TrackerByRegionService], (service: TrackerByRegionService) => {
    expect(service).toBeTruthy();
  }));
});
