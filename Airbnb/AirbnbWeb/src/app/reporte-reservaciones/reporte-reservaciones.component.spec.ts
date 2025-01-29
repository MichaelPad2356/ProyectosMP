import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ReporteReservacionesComponent } from './reporte-reservaciones.component';

describe('ReporteReservacionesComponent', () => {
  let component: ReporteReservacionesComponent;
  let fixture: ComponentFixture<ReporteReservacionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ReporteReservacionesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(ReporteReservacionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
