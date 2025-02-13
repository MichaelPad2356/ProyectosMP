import { Component, Output, EventEmitter } from '@angular/core';
import { AdoptionStory } from '../adoption-story.model';

@Component({
  selector: 'app-historias-adopciones',
  standalone: true,
  imports: [],
  templateUrl: './historias-adopciones.component.html',
  styleUrl: './historias-adopciones.component.css'
})
export class HistoriasAdopcionesComponent {
  @Output() storySelected = new EventEmitter<AdoptionStory>();

  stories: AdoptionStory[] = [
    { 
      id: 1, 
      title: 'Una nueva familia para Rufus', 
      summary: 'Un perro abandonado encuentra un hogar amoroso.', 
      details: 'Rufus fue encontrado por un grupo de rescatistas en un estado deplorable, desnutrido y deshidratado, vagando por las calles. Después de ser rescatado, recibió atención veterinaria y mucho amor. A medida que se recuperaba, su personalidad amigable y juguetona comenzó a brillar. Finalmente, una familia cariñosa lo adoptó y ahora disfruta de una vida llena de amor y cuidados.', 
      imageUrl: 'assets/imagenes/mascotas_adoptadas/Ex1.jpg', 
      date: '24/02/2020' 
    },
    { 
      id: 2, 
      title: 'Misi, la gatita aventurera', 
      summary: 'Una gatita callejera se convierte en la mejor compañera.', 
      details: 'Misi fue encontrada en un callejón, temblando de frío y hambre. Después de ser rescatada, recibió atención médica y comenzó su proceso de socialización. A pesar de sus experiencias difíciles, Misi mostró una gran disposición para confiar en los humanos y pronto se convirtió en una gata cariñosa y juguetona. Fue adoptada por una familia que la adora y ahora vive una vida llena de aventuras y mimos.', 
      imageUrl: 'assets/imagenes/mascotas_adoptadas/Ext1.webp', 
      date: '29/02/2020' 
    },
    { 
      id: 3, 
      title: 'Luna encuentra su hogar para siempre', 
      summary: 'Una perrita rescatada finalmente encuentra un lugar donde pertenecer.', 
      details: 'Luna fue rescatada de una situación de abandono extremo, donde vivía en condiciones insalubres y carecía de los cuidados necesarios. Después de ser rescatada, recibió tratamiento médico y mucho amor y atención. A pesar de su pasado difícil, Luna demostró ser una perrita cariñosa y leal. Una familia compasiva la adoptó y ahora Luna disfruta de una vida feliz y segura en su nuevo hogar.', 
      imageUrl: 'assets/imagenes/mascotas_adoptadas/Ex2.webp', 
      date: '05/04/2020' 
    },
    { 
      id: 4, 
      title: 'El viaje de Bella hacia el amor', 
      summary: 'Una gata maltratada se recupera y encuentra amor en su nuevo hogar.', 
      details: 'Bella fue encontrada en un estado lamentable, sufriendo de malnutrición y abuso. Después de ser rescatada, Bella recibió atención veterinaria y se embarcó en un largo viaje hacia la recuperación física y emocional. Con el amor y la paciencia de sus cuidadores, Bella floreció y reveló su naturaleza cariñosa y juguetona. Una familia comprensiva la adoptó y ahora Bella vive una vida plena y feliz rodeada de amor y cuidados.', 
      imageUrl: 'assets/imagenes/mascotas_adoptadas/Ext2.jpeg', 
      date: '20/04/2020' 
    },
    { 
      id: 5, 
      title: 'El resurgir de Simon', 
      summary: 'Un gato callejero supera las adversidades y encuentra un hogar.', 
      details: 'Simon fue encontrado en un estado deplorable, luchando por sobrevivir en las calles. Después de ser rescatado, recibió atención médica y fue llevado a un refugio. A pesar de sus dificultades iniciales, Simon demostró ser un gato valiente y resistente. Con el tiempo, su personalidad afectuosa y juguetona cautivó a una familia compasiva que decidió darle un hogar para siempre.', 
      imageUrl: 'assets/imagenes/mascotas_adoptadas/Ext3.jpg', 
      date: '10/05/2020' 
    },
    { 
      id: 6, 
      title: 'La transformación de Coco', 
      summary: 'De ser un perro maltratado a un miembro querido de la familia.', 
      details: 'Coco fue rescatado de un entorno de abuso, donde sufría maltratos y descuido. Después de ser rescatado, Coco recibió tratamiento médico y rehabilitación emocional. A pesar de sus traumas pasados, demostró ser un perro dulce y cariñoso. Una familia amorosa lo adoptó y le dio un hogar lleno de amor y cuidados, donde ahora disfruta de una vida plena y feliz.', 
      imageUrl: 'assets/imagenes/mascotas_adoptadas/Ex3.jpg', 
      date: '18/06/2020' 
    },
  ];
  

  selectStory(story: AdoptionStory) {
    this.storySelected.emit(story);
  }

}
