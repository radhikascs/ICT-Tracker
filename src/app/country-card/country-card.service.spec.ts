/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CountryCardService } from './country-card.service';

describe('CountryCardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CountryCardService]
    });
  });

  it('should ...', inject([CountryCardService], (service: CountryCardService) => {
    expect(service).toBeTruthy();
  }));
});
