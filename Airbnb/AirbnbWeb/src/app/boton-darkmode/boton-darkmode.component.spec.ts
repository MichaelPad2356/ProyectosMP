import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BotonDarkmodeComponent } from './boton-darkmode.component';

describe('BotonDarkmodeComponent', () => {
  let component: BotonDarkmodeComponent;
  let fixture: ComponentFixture<BotonDarkmodeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BotonDarkmodeComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BotonDarkmodeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
