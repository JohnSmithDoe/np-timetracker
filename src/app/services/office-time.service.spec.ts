import { TestBed } from '@angular/core/testing';

import { OfficeTimeService } from './office-time.service';

describe('OfficeTimeServiceService', () => {
  let service: OfficeTimeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OfficeTimeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
