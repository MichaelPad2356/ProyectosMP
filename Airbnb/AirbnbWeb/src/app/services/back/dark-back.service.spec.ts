import { TestBed } from '@angular/core/testing';

import { DarkBackService } from './dark-back.service';

describe('DarkBackService', () => {
  let service: DarkBackService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DarkBackService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
