import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-unirgrupo',
  imports: [RouterModule],
  templateUrl: './unirgrupo.component.html',
  styleUrl: './unirgrupo.component.css'
})

export class UnirGrupoComponent implements OnInit {

  gruposDisponibles: any[] = [];

  constructor(private http: HttpClient, private router: Router) {}

  ngOnInit(): void {
    this.obtenerGruposDisponibles(); // Cargar los grupos disponibles
  }

  obtenerGruposDisponibles(): void {
    const usuarioId = localStorage.getItem('userId'); // Obtener el usuarioId desde el LocalStorage
    if (!usuarioId) {
        alert('Usuario no identificado. Por favor, inicia sesión.');
        return;
    }

    this.http.get<any[]>(`http://192.168.50.20:3001/gruposdisponibles/${usuarioId}`)
      .subscribe(
        data => {
          this.gruposDisponibles = data; // Procesar los datos recibidos
        },
        error => {
          console.error('Error al obtener los grupos', error);
        }
      );
}


    unirseAGrupo(grupoId: number): void {
      const usuarioId = localStorage.getItem('userId'); 
      if (!usuarioId) {
        alert('Debes iniciar sesión para unirte a un grupo');
        this.router.navigate(['/login']);
        return;
      }
    
      // Se hacee la solicitud POST para unirse al grupo
      this.http.post<any>('http://192.168.50.20:3001/api/grupos/unirse', {
        groupId: grupoId,
        userId: usuarioId
      })
      .subscribe(
        response => {
          console.log(response); 
          alert('Te has unido al grupo exitosamente: ' + grupoId + ": " + usuarioId);
          this.obtenerGruposDisponibles(); 
    
          // Se actualizar disponibilidad 
          this.actualizarDisponibilidad(grupoId);
        },
        error => {
          console.error('Error al unirse al grupo', error);
          alert('No se pudo unir al grupo: ' + error.error.message);
        }
      );
    }
    
    actualizarDisponibilidad(groupId: number) {
      this.http.put<any>(`http://192.168.50.20:3001/api/servicio-suscripcion/actualizar/${groupId}`, {})
        .subscribe(
          (response) => {
            console.log(response.message, 'Disponibilidad:', response.disponibilidad);
            alert(`La disponibilidad del grupo ${groupId} se actualizó a: ${response.disponibilidad}`);
          },
          (error) => {
            console.error('Error al actualizar la disponibilidad:', error);
            alert('Error al verificar o actualizar la disponibilidad.');
          }
        );
    }
    
    
}