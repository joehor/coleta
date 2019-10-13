import { TestBed } from '@angular/core/testing';

import { RepresentantesLookupService } from './representantes-lookup.service';

describe('RepresentantesLookupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RepresentantesLookupService = TestBed.get(RepresentantesLookupService);
    expect(service).toBeTruthy();
  });
});
