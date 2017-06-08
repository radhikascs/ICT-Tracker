/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ComparisonCardService } from './comparison-card.service';

describe('ComparisonCardService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ComparisonCardService]
    });
  });

  it('should ...', inject([ComparisonCardService], (service: ComparisonCardService) => {
    expect(service).toBeTruthy();
  }));
});
