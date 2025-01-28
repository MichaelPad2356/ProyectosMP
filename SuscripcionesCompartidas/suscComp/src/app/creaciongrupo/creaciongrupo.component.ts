import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-creaciongrupo',
  imports: [RouterModule, FormsModule],
  templateUrl: './creaciongrupo.component.html',
  styleUrl: './creaciongrupo.component.css'
})
export class CreaciongrupoComponent {
  groupData = {
    name: '',
    serviceType: '',
    maxUsers: null,
    costPerUser: 0,
    paymentPolicy: 'monthly'
  };

  constructor(private http: HttpClient, private router: Router) {}

  onSubmit() {
    if (!this.groupData.name || !this.groupData.serviceType || !this.groupData.maxUsers || !this.groupData.costPerUser) {
      alert('Por favor, completa todos los campos.');
      return;
    }
  
    const userId = localStorage.getItem('userId');
    if (!userId) {
      alert('No se puede crear el grupo. El usuario no está logueado.');
      return;
    }
  
    const grupoConUsuario = {
      ...this.groupData,
      currentUsers: 1, 
      userId: parseInt(userId, 10),
      costPerUser: Number(this.groupData.costPerUser) || 0 
    };
    

    // Crear grupo
this.http.post<{ groupId: number }>('http://192.168.50.20:3001/api/grupos/crear', grupoConUsuario)
.subscribe(
  (response) => {
    console.log('Grupo creado:', response);

   
    this.guardarSuscripcion(this.groupData.serviceType, this.groupData.costPerUser, response.groupId);
  },
  (error) => {
    console.error('Error al crear el grupo', error);
    alert('Hubo un error al crear el grupo.');
  }
);
}

guardarSuscripcion(serviceType: string, cost: number, groupId: number) {
const suscripcionData = {
  tipoServicio: serviceType,
  costo: cost,
  disponibilidad: 'SI',
  groupId: groupId // Añadir el ID del grupo
};

this.http.post('http://192.168.50.20:3001/api/servicio-suscripcion/guardar', suscripcionData)
  .subscribe(
    (response) => {
      console.log('Suscripción guardada:', response);
      alert('Suscripción guardada exitosamente.');
    },
    (error) => {
      console.error('Error al guardar la suscripción:', error);
      alert('Error al guardar la suscripción.');
    }
  );
}
  
}




