import { TestBed } from '@angular/core/testing';

import { DataLookupService } from './data-lookup.service';

describe('DataLookupService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataLookupService = TestBed.get(DataLookupService);
    expect(service).toBeTruthy();
  });
});
