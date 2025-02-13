import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AyudainfoComponent } from './ayudainfo.component';

describe('AyudainfoComponent', () => {
  let component: AyudainfoComponent;
  let fixture: ComponentFixture<AyudainfoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AyudainfoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AyudainfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
