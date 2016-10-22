/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { BlogServiceService } from './blog-service.service';

describe('Service: BlogService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [BlogServiceService]
    });
  });

  it('should ...', inject([BlogServiceService], (service: BlogServiceService) => {
    expect(service).toBeTruthy();
  }));
});
