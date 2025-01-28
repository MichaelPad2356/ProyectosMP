import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { loadStripe } from '@stripe/stripe-js'; // Importar Stripe.js

@Component({
  selector: 'app-misgrupos',
  templateUrl: './misgrupos.component.html',
  styleUrls: ['./misgrupos.component.css']
})
export class MisGruposComponent implements OnInit, OnDestroy {
  grupos: any[] = []; // Para almacenar los grupos del usuario
  notificaciones: any[] = []; // Para las notificaciones del usuario
  errorMessage: string = ''; 
  stripe: any;
  elements: any;
  card: any;
  notificacionesInterval: any;  

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    const usuarioId = localStorage.getItem('userId');
    if (!usuarioId) {
      console.error('No se encontró un usuario logueado.');
      this.errorMessage = 'Por favor, inicia sesión para ver tus grupos.';
      return;
    }

    // Obtener los grupos
    /*this.http.get<any[]>(`http://192.168.50.20:3001/api/grupos/usuario?usuarioId=${usuarioId}`)
      .subscribe(
        (grupos) => { this.grupos = grupos; },
        (error) => { console.error('Error al obtener los grupos:', error); this.errorMessage = 'Error al cargar tus grupos. Intenta nuevamente más tarde.'; }
      ); */


      this.http.get<any[]>(`http://192.168.50.20:3001/api/grupos/usuario?usuarioId=${usuarioId}`)
      .subscribe(
      (grupos) => {
          // Mapear los grupos con propiedades adicionales
          this.grupos = grupos.map(grupo => ({
            ...grupo,
            isCreatedByUser: !!grupo.createdAt,  
            isJoinedByUser: !!grupo.joinedAt    
          }));
      },
      (error) => {
          console.error('Error al obtener los grupos:', error);
          this.errorMessage = 'Error al cargar tus grupos. Intenta nuevamente más tarde.';
      }
      );


     // Obtener las notificaciones inicialmente
     this.http.get<any[]>(`http://192.168.50.20:3001/api/notificaciones/vencimientos`)
     .subscribe(
       (notificaciones) => { 
         this.notificaciones = notificaciones.filter(n => n.userId === parseInt(usuarioId || '0'));
         console.log('Notificaciones recibidas:', this.notificaciones);

        
         this.notificaciones.forEach((notificacion, index) => {
           setTimeout(() => {
             this.notificaciones.splice(index, 1);  
           }, 10000);
         });
       },
       (error) => { 
         console.error('Error al obtener las notificaciones:', error); 
         this.errorMessage = 'Error al cargar tus notificaciones.'; 
       }
     );

   
   this.notificacionesInterval = setInterval(() => {
     this.http.get<any[]>(`http://192.168.50.20:3001/api/notificaciones/vencimientos`)
       .subscribe(
         (notificaciones) => { 
           this.notificaciones = notificaciones.filter(n => n.userId === parseInt(usuarioId || '0')); 
         },
         (error) => { 
           console.error('Error al obtener las notificaciones:', error); 
           this.errorMessage = 'Error al cargar tus notificaciones.'; 
         }
       );
   }, 60000);  
  

    // Cargar Stripe.js
    loadStripe('pk_test_51QTYY1KKAL9Zx73kVaH7pAwFyqaSPByJFrZCQKpfzLwRgE9WTWHx6lJxKfXkhK3dgOCBTFlmSGHjBUvtJJyOSM7r00PzjBxalJ')
    .then((stripe) => {
      if (stripe) {  
        this.stripe = stripe;
        this.elements = stripe.elements();
        this.card = this.elements.create('card');
        this.card.mount('#card-element');
      } else {
        console.error('Stripe no se cargó correctamente');
      }
    })
    .catch((error) => {
      console.error('Error al cargar Stripe:', error);
    });
  }

  ngOnDestroy(): void {
    
    if (this.notificacionesInterval) {
      clearInterval(this.notificacionesInterval);
    }
  }

  simularPago(grupoId: number, monto: number): void {
    const userId = localStorage.getItem('userId'); 
    if (!userId) {
      alert('No se ha encontrado un usuario logueado.');
      return;
    }
  
    this.http.post(`http://192.168.50.20:3001/api/pagos/simular`, {
      userId: userId,      
      groupId: grupoId,    
      amount: monto        
    }).subscribe(
      (res: any) => {
        const { clientSecret } = res;  // Obtener el clientSecret desde el servidor
        this.confirmPayment(clientSecret); // Confirmar el pago usando Stripe Elements
      },
      (error) => { 
        console.error('Error en la simulación de pago:', error);
        alert('Hubo un problema al procesar la simulación. Inténtalo de nuevo.');
      }
    );
  }

  
  confirmPayment(clientSecret: string) {
    this.stripe.confirmCardPayment(clientSecret, {
      payment_method: {
        card: this.card,
        billing_details: {
          name: 'Nombre del Usuario',  
        },
      },
    }).then((result: any) => {
      if (result.error) {
        console.error('Error al procesar la simulación:', result.error);
        alert('Hubo un error en la simulación del pago. Inténtalo de nuevo.');
      } else {
        if (result.paymentIntent.status === 'succeeded') {
          alert('Pago realizado con éxito!');
        }
      }
    });
  }


  darDeBajaGrupo(grupoId: number): void {
    const confirmacion = confirm('¿Estás seguro de que deseas dar de baja este grupo? Esta acción es irreversible.');
  
    if (!confirmacion) {
      return; 
    }
  
    // Realizar la petición DELETE al servidor
    this.http.delete<any>(`http://192.168.50.20:3001/api/grupos/baja/${grupoId}`)
      .subscribe(
        response => {
          console.log(response.message);
          alert(`El grupo ha sido dado de baja. La página se recargará en 3 segundos.`);
  
          
          setTimeout(() => {
            window.location.reload();
          }, 3000); 
        },
        error => {
          console.error('Error al dar de baja el grupo:', error);
          alert('Error al dar de baja el grupo: ' + error.error.message);
        }
      );
  }
  
  
  salirDelGrupo(grupoId: number): void {
    const userId = localStorage.getItem('userId'); 
  
    if (!userId) {
      alert('Debes iniciar sesión para salir de un grupo');
      
      return;
    }
  
    // Realizar la petición DELETE
    this.http.delete<any>(`http://192.168.50.20:3001/api/grupos/salir/${grupoId}/${userId}`)
      .subscribe(
        response => {
          console.log(response.message);
          alert('Has salido del grupo exitosamente');

            
            this.actualizarDisponibilidad(grupoId);
          
          
          setTimeout(() => {
            window.location.reload();
          }, 4000); 
        },
        error => {
          console.error('Error al salir del grupo:', error);
          alert('No se pudo salir del grupo: ' + error.error.message);
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
