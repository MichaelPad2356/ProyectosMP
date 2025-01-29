import { ComponentFixture, TestBed } from '@angular/core/testing';

import { StantardComponent } from './stantard.component';

describe('StantardComponent', () => {
  let component: StantardComponent;
  let fixture: ComponentFixture<StantardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [StantardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(StantardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
