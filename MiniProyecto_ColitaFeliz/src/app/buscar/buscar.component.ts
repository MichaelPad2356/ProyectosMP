import { Component, OnInit } from '@angular/core';
import { CitasService } from '../serv2/citas.service';
import { Citas } from '../citas';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import Swal from 'sweetalert2';

@Component({
  selector: 'app-buscar',
  standalone: true,
  imports: [RouterModule,FormsModule],
  templateUrl: './buscar.component.html',
  styleUrls: ['./buscar.component.css'],
})


export class BuscarComponent {
  nombreABuscar: string = '';
  name: string = '';
  clienteEncontrado: Citas | undefined;
  buscado: boolean = false;

  constructor(private citasService: CitasService) { }

  buscarCliente() {
    console.log("Nombre a buscar:", this.name);
    const clientes = this.citasService.getClientes();
    console.log("Clientes en el servicio:", clientes);
    this.clienteEncontrado = clientes.find(cliente => cliente.nombreCte === this.nombreABuscar);
    console.log("Cliente encontrado:", this.clienteEncontrado);
    this.buscado = true;
  }



}
