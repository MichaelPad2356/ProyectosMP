import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaceDisplayComponent } from './place-display.component';

describe('PlaceDisplayComponent', () => {
  let component: PlaceDisplayComponent;
  let fixture: ComponentFixture<PlaceDisplayComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlaceDisplayComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlaceDisplayComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
