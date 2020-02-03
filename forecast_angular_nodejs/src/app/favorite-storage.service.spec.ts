import { TestBed } from '@angular/core/testing';

import { FavoriteStorageService } from './favorite-storage.service';

describe('FavoriteStorageService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FavoriteStorageService = TestBed.get(FavoriteStorageService);
    expect(service).toBeTruthy();
  });
});
