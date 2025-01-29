import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AltaOrdenProduccionComponent } from './alta-orden-produccion.component';

describe('AltaOrdenProduccionComponent', () => {
  let component: AltaOrdenProduccionComponent;
  let fixture: ComponentFixture<AltaOrdenProduccionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AltaOrdenProduccionComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AltaOrdenProduccionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
