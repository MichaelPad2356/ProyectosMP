import { Injectable } from '@angular/core';
import { Reserva } from '../interfaces/reservas';

@Injectable({
  providedIn: 'root'
})
export class ReservasService {
  reservas !: Reserva[];

  constructor() { 
    this.reservas=JSON.parse(localStorage.getItem("data") || '[]');
    /*|| '[]' significa que si no recupera datos entonces asigne el array vacio*/
  }

  getReservas(){
    return this.reservas;
  }

  agregarReserva(reserva: Reserva) {
    this.reservas.push(reserva);
    localStorage.setItem('data', JSON.stringify(this.reservas));
  }

  nuevaReserva(): Reserva {
    return {
      fecha: '',
      hora: '',
      dias: '',
      nombre: '',
      telefono: '',
      email: '',
      direccion: '',
      imagen: '',
      precioTotal: 0,
    };
  }

}
