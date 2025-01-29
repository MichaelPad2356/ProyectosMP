// nosotros.component.ts
import { Component } from '@angular/core';

interface TeamMember {
  name: string;
  role: string;
  image: string;
  bio: string;
}

@Component({
  selector: 'app-nosotros',
  templateUrl: './nosotros.component.html',
  styleUrls: ['./nosotros.component.scss']
})
export class NosotrosComponent {
  teamMembers: TeamMember[] = [
    {
      name: 'Diego Perez',
      role: 'CEO y Fundador',
      image: 'assets/images/hombre.png',
      bio: 'Sommelier de renombre con más de 20 años de experiencia en la industria del vino.'
    },
    {
      name: 'Mariana Avila',
      role: 'Directora de Marketing',
      image: 'assets/images/mujer.png',
      bio: 'Experta en estrategias de marca con pasión por comunicar la elegancia de los vinos.'
    },
    {
      name: 'Daniel Lopez',
      role: 'Director de Producción',
      image: 'assets/images/hombre2.png',
      bio: 'Enólogo certificado con un profundo conocimiento de las técnicas de vinificación.'
    }
  ];
}