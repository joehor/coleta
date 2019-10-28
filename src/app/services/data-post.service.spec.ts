import { TestBed } from '@angular/core/testing';

import { DataPostService } from './data-post.service';

describe('DataPostService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DataPostService = TestBed.get(DataPostService);
    expect(service).toBeTruthy();
  });
});
