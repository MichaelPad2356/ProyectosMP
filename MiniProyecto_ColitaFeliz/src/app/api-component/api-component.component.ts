import { Component } from '@angular/core';
import { ServicioApiService } from '../serv3/servicio-api.service';
import { Perro } from '../perro.model';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-api-component',
  standalone: true,
  imports: [],
  templateUrl: './api-component.component.html',
  styleUrl: './api-component.component.css'
})
export class ApiComponentComponent {
  constructor(private servicioApiService: ServicioApiService){}

  datos: Perro[] = [];
  cargando: boolean = true;
  i:number = 0;

  ngOnInit() {
    this.getDatos().subscribe(
      (data) => {
        this.datos = data;
        this.cargando = false;
      },
      (error) => {
        this.handleError(error);
        this.cargando = false;
      }
    );
  }

  getDatos(): Observable<Perro[]> {
    return this.servicioApiService.getData();
  }

  trackByFn(index: number, perro: Perro): number {
    return perro.id;
  }

  handleError(error: any): void {
    if (error instanceof ErrorEvent) {
      // Error del lado del cliente
      console.log('Error en la solicitud:', error.error.message);
    } else {
      // Error del lado del servidor
      if (error.status === 0) {
        // Error de CORS
        console.log('No se pudo conectar con el servidor.');
      } else if (error.status === 429) {
        // Error 429 (Too Many Requests)
        console.log('Demasiadas solicitudes. Inténtalo de nuevo más tarde.');
      } else if (error.error && error.error.message) {
        // Otros errores con mensaje
        console.log(error.error.message);
      } else {
        // Otros errores sin mensaje
        console.error('Ocurrió un error:', error);
      }
    }
  }

}
