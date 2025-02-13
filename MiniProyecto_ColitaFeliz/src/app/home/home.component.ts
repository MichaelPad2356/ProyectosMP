import { Component } from '@angular/core';
import { FooterComponent } from '../footer/footer.component';
import { HistoriasAdopcionesComponent } from '../historias-adopciones/historias-adopciones.component';
import { AdoptionStory } from '../adoption-story.model';
import { Preguntas } from '../preguntas.model';
import { PreguntasFrecuentesComponent } from '../preguntas-frecuentes/preguntas-frecuentes.component';
import { ApiComponentComponent } from '../api-component/api-component.component';
import { CarruselComponent } from '../carrusel/carrusel.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FooterComponent, HistoriasAdopcionesComponent, PreguntasFrecuentesComponent, ApiComponentComponent, CarruselComponent],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  selectedStory?: AdoptionStory;
  

  showStoryDetails(story: AdoptionStory) {
    this.selectedStory = story;
  }

  faqs: Preguntas[] = [
    {
      pregunta: '¿Cuáles son los requisitos para adoptar una mascota?',
      respuesta: 'Los principales requisitos son: ser mayor de edad, contar con un entorno adecuado para la mascota y firmar un contrato de adopción responsable.',
      mostrarResp: false
    },
    {
      pregunta: '¿Cuánto cuesta adoptar una mascota?',
      respuesta: 'En Colita Feliz, la adopción tiene un costo simbólico de $50 para cubrir los gastos de esterilización y vacunación.',
      mostrarResp: false
    },
    {
      pregunta: '¿Puedo devolver a la mascota si ya no me interesa?',
      respuesta: 'No aceptamos devoluciones. La adopción es un compromiso de por vida. Sin embargo, ofrecemos asesoramiento y apoyo para ayudar a que la transición sea exitosa.',
      mostrarResp: false
    },
    {
      pregunta: '¿Qué debo hacer si mi mascota se extravía?',
      respuesta: 'En caso de extravío, es importante informar inmediatamente a las autoridades locales de control animal y difundir la información en redes sociales y carteles en la zona. También asegúrate de que tu mascota lleve un collar con identificación y esté microchipada para aumentar las posibilidades de encontrarla.',
      mostrarResp: false
    },
    {
      pregunta: '¿Cómo puedo socializar a mi mascota recién adoptada?',
      respuesta: 'La socialización es crucial para el bienestar de tu mascota. Introduce gradualmente a tu mascota a diferentes personas, animales y entornos. Ofrece recompensas y refuerzo positivo para ayudar a crear asociaciones positivas. Si tienes dificultades, considera la posibilidad de buscar la ayuda de un entrenador profesional de mascotas.',
      mostrarResp: false
    },
    {
      pregunta: '¿Qué debo hacer si mi mascota muestra signos de enfermedad?',
      respuesta: 'Si observas signos de enfermedad en tu mascota, como letargo, falta de apetito o síntomas respiratorios, es importante llevarla al veterinario de inmediato para recibir atención médica. No intentes diagnosticar ni tratar a tu mascota por tu cuenta, ya que esto puede empeorar su condición.',
      mostrarResp: false
    }
  ];
  

}
