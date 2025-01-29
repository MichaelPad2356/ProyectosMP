import { TestBed } from '@angular/core/testing';

import { FirebaseStuffService } from './firebase-stuff.service';

describe('FirebaseStuffService', () => {
  let service: FirebaseStuffService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FirebaseStuffService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
