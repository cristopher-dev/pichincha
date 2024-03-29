import { TestBed } from '@angular/core/testing';

import { DateUtilitiesService } from './date-utilities.service';
import { HttpClientModule } from '@angular/common/http';

beforeEach(async () => {
  await TestBed.configureTestingModule({
    imports: [HttpClientModule],
  }).compileComponents();
});
describe('DateUtilitiesService', () => {
  let service: DateUtilitiesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateUtilitiesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
