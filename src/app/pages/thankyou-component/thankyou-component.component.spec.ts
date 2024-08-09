import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThankyouComponentComponent } from './thankyou-component.component';

describe('ThankyouComponentComponent', () => {
  let component: ThankyouComponentComponent;
  let fixture: ComponentFixture<ThankyouComponentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ThankyouComponentComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ThankyouComponentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
