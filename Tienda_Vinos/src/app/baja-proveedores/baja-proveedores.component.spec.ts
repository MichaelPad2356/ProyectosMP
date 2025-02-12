import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BajaProveedoresComponent } from './baja-proveedores.component';

describe('BajaProveedoresComponent', () => {
  let component: BajaProveedoresComponent;
  let fixture: ComponentFixture<BajaProveedoresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BajaProveedoresComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(BajaProveedoresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
