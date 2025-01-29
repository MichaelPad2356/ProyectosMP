import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ReaderService {

    // Inicializa el objeto de síntesis de voz
    synth = window.speechSynthesis;

    // Crea una instancia de SpeechSynthesisUtterance para definir lo que se va a leer en voz alta
    utterance = new SpeechSynthesisUtterance();

    // Crea un BehaviorSubject para controlar el estado de lectura (true si está leyendo, false si no)
    private isReadingSubject = new BehaviorSubject<boolean>(false);

    // Crea un BehaviorSubject para controlar el estado de pausa (true si está en pausa, false si no)
    private isPauseSubject = new BehaviorSubject<boolean>(false);

    // Variable para almacenar el contenido a leer
    content: string = '';

    // Crea un observable para isReadingSubject, permitiendo a otros componentes suscribirse a los cambios
    isReading$ = this.isReadingSubject.asObservable();

    // Crea un observable para isPauseSubject, permitiendo a otros componentes suscribirse a los cambios
    isPause$ = this.isPauseSubject.asObservable();

    // Constructor del servicio, se deja vacío ya que no se necesita inicialización adicional
    constructor() { }

    // Método para comenzar la lectura de un contenido
    startReading(content: string) {
      // Si ya se está leyendo algo, cancela la lectura actual
      if (this.isReadingSubject.value) {
        this.synth.cancel();
      }
      // Establece el contenido a leer en el objeto utterance
      this.utterance.text = content;
      // Inicia la lectura del contenido
      this.synth.speak(this.utterance);
      // Actualiza el estado de lectura a true
      this.isReadingSubject.next(true);
      // Actualiza el estado de pausa a false
      this.isPauseSubject.next(false);
      // Cuando la lectura termine, actualiza el estado de lectura a false
      this.utterance.onend = () => {
        this.isReadingSubject.next(false);
      };
    }

    // Método para pausar la lectura
    pauseReading() {
      // Pausa la síntesis de voz
      this.synth.pause();
      // Actualiza el estado de pausa a true
      this.isPauseSubject.next(true);
      // Actualiza el estado de lectura a false
      this.isReadingSubject.next(false);
    }

    // Método para reanudar la lectura
    resumeReading() {
      // Reanuda la síntesis de voz
      this.synth.resume();
      // Actualiza el estado de lectura a true
      this.isReadingSubject.next(true);
      // Actualiza el estado de pausa a false
      this.isPauseSubject.next(false);
    }

    // Método para detener la lectura
    stopReading() {
      // Cancela la síntesis de voz
      this.synth.cancel();
      // Actualiza el estado de lectura a false
      this.isReadingSubject.next(false);
      // Actualiza el estado de pausa a false
      this.isPauseSubject.next(false);
    }
}
