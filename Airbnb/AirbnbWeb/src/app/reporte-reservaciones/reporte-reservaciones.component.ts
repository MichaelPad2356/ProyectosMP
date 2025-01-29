import {Component} from '@angular/core';
import {MatTableModule} from '@angular/material/table';
import { DarkBackService } from '../services/back/dark-back.service';
import { CommonModule } from '@angular/common';
import {MatTabsModule} from '@angular/material/tabs';
import { Reserva } from '../interfaces/reservas';
import { QRCodeModule } from 'angularx-qrcode';
import { QRCodeComponent } from 'angularx-qrcode';
import { FirebaseStuffService } from '../services/firebaseService/firebase-stuff.service';
import { UserDataService } from '../services/firebaseService/user-data.service';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import Swal from 'sweetalert2';
import { SpinnerComponent } from '../spinner/spinner.component';
import { ReservaFB } from '../interfaces/reservasFB';
import { JsonPipe } from '@angular/common';
import * as bootstrap from 'bootstrap';


@Component({
  selector: 'app-reporte-reservaciones',
  standalone: true,
  imports: [MatTableModule, CommonModule, MatTabsModule, RouterModule, SpinnerComponent, QRCodeModule, JsonPipe],
  templateUrl: './reporte-reservaciones.component.html',
  styleUrl: './reporte-reservaciones.component.css'
})
export class ReporteReservacionesComponent {

  reservasfb: ReservaFB[];
  previas: ReservaFB[] = [];
  proximas: ReservaFB[] = [];
  dark : boolean = false;
  background : string = "white";
  color : string = "black";
  displayedColumns: string[] = ['Fecha', 'Hora', 'Dias', 'Nombre', 'Telefono', 'Email', 'Direccion', 'PrecioTotal', 'QR' , 'Eliminar'];
  selectedData: string = '';
  fechaPrueba: Date = new Date();

  constructor(public darkBackService: DarkBackService, private firebaseStuff: FirebaseStuffService, public userData: UserDataService, private router: Router){
    this.reservasfb = [];
  }
  user$ = this.firebaseStuff.currentUser$;
  

  ngOnInit(){
    this.user$.subscribe(user => {
      if (!user) {
        Swal.fire({
          icon: 'error',
          title: 'No estás autenticado',
          text: 'Debes iniciar sesión para continuar.',
          showConfirmButton: false,
          timer: 2000
        }).then(() => {
          this.router.navigate(['/login']);
        });
      } else {
        
        this.darkBackService.dark$.subscribe(dark => {
          this.dark = dark;
          this.background = dark ? "black" : "white";
          this.color = dark ? "white" : "black";
        });
        console.log(this.userData.userID, 'Hola amigo');
        this.firebaseStuff.getReservationsByUserId(this.userData.userID).subscribe(data => {
                  
                  this.reservasfb = data;
                  
                  this.reservasfb.forEach(reserva => {
                    reserva.fecha = this.firebaseStuff.timestampToDate(reserva.fecha);
                  });
                  console.log(this.reservasfb, 'reservas');
                  
                  this.dividirReservas();
                  console.log(this.proximas, 'proximas');
                  console.log(this.previas, 'previas');
                });
                
        
      }
    });
  }

  dividirReservas(){
    this.reservasfb.forEach(reserva => {
      if(new Date(reserva.fecha) >= new Date()){
        this.proximas.push(reserva);
      }else{
        this.previas.push(reserva);
      }
    });
  }

  eliminar(reserva: ReservaFB){ {
    this.firebaseStuff.deleteReserva(reserva);
    console.log('Eliminado');
   }
    setTimeout(function() {
      location.reload();
    }, 700);
  }

  qr(reserva: ReservaFB){
    this.selectedData = this.formatReservationData(reserva);
  
    const modalElement = document.getElementById('qrModal');
    if (modalElement) {
      const bsModal = new bootstrap.Modal(modalElement);
      bsModal.show();
    }

   
  }

  formatReservationData(reserva: ReservaFB): string {
    const formattedData = `
      Fecha: ${new Date(reserva.fecha).toLocaleDateString()} \n
      Hora: ${reserva.hora} \n
      Días: ${reserva.dias} \n
      Nombre: ${reserva.nombre} \n
      Teléfono: ${reserva.telefono} \n
      Email: ${reserva.email} \n
      Dirección: ${reserva.direccion} \n
      Limpieza: ${reserva.limpieza ? 'Sí' : 'No'} \n
      Extra WiFi: ${reserva.extraWifi} \n
      Extra Desayuno: ${reserva.extraDesayuno} \n
      Extra Parking: ${reserva.extraParking} \n
      Precio Total: ${reserva.precioTotal} \n
      User ID: ${reserva.userID}
    `;
    return formattedData.trim();
  }
  
}

