import { TestBed } from '@angular/core/testing';

import { BerbixService } from './berbix.service';

describe('BerbixService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BerbixService = TestBed.get(BerbixService);
    expect(service).toBeTruthy();
  });
});
