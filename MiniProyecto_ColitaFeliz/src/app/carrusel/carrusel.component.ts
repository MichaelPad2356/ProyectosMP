import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-carrusel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carrusel.component.html',
  styleUrl: './carrusel.component.css'
})
export class CarruselComponent {

  ngOnInit() {
    this.startSlideshow();
  }

  images = [
    { src: 'assets/imagenes/inicio/c1.jpg', alt: 'Imagen 1', caption: '¿Buscas un amigo peludo? Adopta en Colita Feliz. ¡Salva una vida y encuentra tu compañero perfecto' },
    { src: 'assets/imagenes/inicio/c2.webp', alt: 'Imagen 2', caption: 'Adopta amor en Colita Feliz. Encuentra a tu mejor amigo de cuatro patas hoy mismo.' },
    { src: 'assets/imagenes/inicio/c3.jpg', alt: 'Imagen 3', caption: '¿Sabías que millones de animales terminan en refugios cada año? Muchos de ellos son abandonados o rescatados de situaciones difíciles. Adoptar un animal no solo les da una segunda oportunidad en la vida, sino que también te brinda una conexión inquebrantable y amorosa.' }
  ];
  
  currentIndex = 0;
  interval: any;
  delay = 4500; // Cambia el valor según el retraso deseado en milisegundos


  ngOnDestroy() {
    this.stopSlideshow();
  }

  startSlideshow() {
    this.interval = setInterval(() => {
      this.nextSlide();
    }, this.delay);
  }

  stopSlideshow() {
    clearInterval(this.interval);
  }

  prevSlide() {
    this.currentIndex = (this.currentIndex - 1 + this.images.length) % this.images.length;
  }

  nextSlide() {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }

}
