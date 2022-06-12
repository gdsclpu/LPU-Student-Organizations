import { TestBed } from '@angular/core/testing';

import { PoliciesService } from './policies.service';

describe('PoliciesService', () => {
  let service: PoliciesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PoliciesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
