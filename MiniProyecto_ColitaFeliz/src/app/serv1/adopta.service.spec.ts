import { TestBed } from '@angular/core/testing';

import { AdoptaService } from './adopta.service';

describe('AdoptaService', () => {
  let service: AdoptaService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdoptaService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
