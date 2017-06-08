/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GenerationsRegulationService } from './generations-regulation.service';

describe('GenerationsRegulationService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GenerationsRegulationService]
    });
  });

  it('should ...', inject([GenerationsRegulationService], (service: GenerationsRegulationService) => {
    expect(service).toBeTruthy();
  }));
});
