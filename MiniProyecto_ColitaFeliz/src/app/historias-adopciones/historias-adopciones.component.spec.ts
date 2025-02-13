import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HistoriasAdopcionesComponent } from './historias-adopciones.component';

describe('HistoriasAdopcionesComponent', () => {
  let component: HistoriasAdopcionesComponent;
  let fixture: ComponentFixture<HistoriasAdopcionesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HistoriasAdopcionesComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(HistoriasAdopcionesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
