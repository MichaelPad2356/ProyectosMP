import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BajaOrdenProduccionComponent } from './baja-orden-produccion.component';

describe('BajaOrdenProduccionComponent', () => {
  let component: BajaOrdenProduccionComponent;
  let fixture: ComponentFixture<BajaOrdenProduccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BajaOrdenProduccionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BajaOrdenProduccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
