import { Injectable } from '@angular/core';
import { Citas } from '../citas';

@Injectable({
  providedIn: 'root'
})
export class CitasService {
  clientes!: Citas[];

  

  constructor() { 
    this.clientes=JSON.parse(localStorage.getItem("data") || '[]');
    // || '[]' -> Esto indica que sino se recuperan datos entonces se asigne el array vacio
  }


  getClientes(){
    return this.clientes;
  }

  agregarCliente(cliente: Citas){
    this.clientes.push(cliente);
    localStorage.setItem('data', JSON.stringify(this.clientes));
  }

  nuevoCliente(): Citas{
    return{
      imagen: '',
      nombre: '',
      edad: '',
      sexo: '',
      color: '',
      raza: '',
      tiempoR: '',
      comportamiento: '',
      nombreCte: '',
      telCte: '',
      fechaCte: null,
      horaCte: null

    };
  }
}
