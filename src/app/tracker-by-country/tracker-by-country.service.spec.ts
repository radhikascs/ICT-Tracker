/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TrackerByCountryService } from './tracker-by-country.service';

describe('TrackerByCountryService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TrackerByCountryService]
    });
  });

  it('should ...', inject([TrackerByCountryService], (service: TrackerByCountryService) => {
    expect(service).toBeTruthy();
  }));
});
