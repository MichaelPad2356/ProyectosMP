import { Component } from '@angular/core';
import { DarkBackService } from '../services/back/dark-back.service';
import { PlacesService } from '../services/places.service';
import { CommonModule } from '@angular/common';
import Swal from 'sweetalert2';
import { Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [CommonModule,FormsModule],
  templateUrl: './contact.component.html',
  styleUrl: './contact.component.css'
})

export class ContactComponent {
  dark : boolean = false;
  background : string = "white";
  color : string = "black";
  
   contact = {
    subject: '',
    email: '',
    description: ''
   };

  constructor(private http: HttpClient, public placesService: PlacesService, public darkBackService: DarkBackService) {} // Se inyecta el servicio HttpClient

  onSubmit() { // Método que se ejecuta al enviar el formulario

    //Alerta de confirmación de envio 
    Swal.fire({
      position: "center",
      icon: "success",
      title: "¡Tu correo ha sido enviado!",
      showConfirmButton: false,
      timer: 1500
    });



    //envio de datos al servidor node js
    this.http.post('http://localhost:3000/contact',this.contact).subscribe(
      res => {
        console.log('Correo enviado correctamente', res);
      },
      error =>{
        console.error('Error al enviar el correo', error);
      }
    );
    
    console.log(this.contact); // Aqui se imprime para ver que se almacenaron los datos
  }

  ngOnInit(){
    this.darkBackService.dark$.subscribe(dark => {
      this.dark = dark;
      if(this.dark){
        this.background = "black";
        this.color = "white";
      }else{
        this.background = "white";
        this.color = "black";
      }
    });
  }
}
