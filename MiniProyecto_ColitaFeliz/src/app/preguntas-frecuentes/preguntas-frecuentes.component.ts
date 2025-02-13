import { Component, Input } from '@angular/core';
import { Preguntas } from '../preguntas.model';

@Component({
  selector: 'app-preguntas-frecuentes',
  standalone: true,
  imports: [],
  templateUrl: './preguntas-frecuentes.component.html',
  styleUrl: './preguntas-frecuentes.component.css'
})
export class PreguntasFrecuentesComponent {
  @Input() preguntas: Preguntas[] = [];

}
