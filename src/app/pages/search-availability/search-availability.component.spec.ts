import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SearchAvailabilityComponent } from './search-availability.component';

describe('SearchAvailabilityComponent', () => {
  let component: SearchAvailabilityComponent;
  let fixture: ComponentFixture<SearchAvailabilityComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchAvailabilityComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(SearchAvailabilityComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
