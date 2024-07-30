import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HotelPropertiesComponent } from './hotel-properties.component';

describe('HotelPropertiesComponent', () => {
  let component: HotelPropertiesComponent;
  let fixture: ComponentFixture<HotelPropertiesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HotelPropertiesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HotelPropertiesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
