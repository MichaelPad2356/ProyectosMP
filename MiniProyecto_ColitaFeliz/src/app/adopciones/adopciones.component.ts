import { Component, ChangeDetectorRef } from '@angular/core';
import { AdoptaService } from '../serv1/adopta.service';
import { animPeGa } from '../animales';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FooterComponent } from '../footer/footer.component';

@Component({
  selector: 'app-adopciones',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule, FooterComponent],
  templateUrl: './adopciones.component.html',
  styleUrls: ['./adopciones.component.css']
})
export class AdopcionesComponent {
  randomColor: string = this.generateRandomColor();
  adoptIndex: number = 0;
  i: number = 0;
  animalesAdop: animPeGa[] = [];

  constructor(public adoptaService: AdoptaService, private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.animalesAdop = this.adoptaService.getAnimales();
  }

  generateRandomColor(): string {
    let r = Math.floor(Math.random() * 256);
    let g = Math.floor(Math.random() * 256);
    let b = Math.floor(Math.random() * 256);
    const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
    const minLuminance = 0.2;
    const maxLuminance = 0.8;
    if (luminance < minLuminance) {
      r = Math.min(Math.floor(r * (minLuminance / luminance)), 255);
      g = Math.min(Math.floor(g * (minLuminance / luminance)), 255);
      b = Math.min(Math.floor(b * (minLuminance / luminance)), 255);
    } else if (luminance > maxLuminance) {
      r = Math.max(Math.floor(r * (maxLuminance / luminance)), 0);
      g = Math.max(Math.floor(g * (maxLuminance / luminance)), 0);
      b = Math.max(Math.floor(b * (maxLuminance / luminance)), 0);
    }
    return `rgb(${r}, ${g}, ${b})`;
  }

  regenerateRandomColor() {
    this.randomColor = this.generateRandomColor();
    // Si aún tienes el problema después de mover la lógica a un método separado,
    // puedes forzar la detección de cambios aquí:
    // this.cdr.detectChanges();
  }
}