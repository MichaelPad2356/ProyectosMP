import { Component, ChangeDetectorRef  } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Places } from '../interfaces/places';
import { PlacesService } from '../services/places.service';
import { DarkBackService } from '../services/back/dark-back.service';
import { CommonModule, NgIf } from '@angular/common';
import { SecurePipe } from '../secure.pipe';
import { FilterService } from '../services/filter.service';
import { FirebaseStuffService } from '../services/firebaseService/firebase-stuff.service';
import { UserDataService } from '../services/firebaseService/user-data.service';

import { ReaderService } from '../services/reader.service';

import { PricePipe } from '../price.pipe';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [RouterModule, CommonModule, SecurePipe, NgIf, PricePipe],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  array:Places[]=[];
  filter:Places[]=[];
  dark : boolean = false;
  background : string = "white";
  color : string = "black";
  url: string = "faiqd9Crpmg?si=AvhGc4-EmHppoD6q";

  constructor(public placesService: PlacesService, public darkBackService: DarkBackService, private filterService: FilterService, private firebaseStuff : FirebaseStuffService, public userData: UserDataService, private readerService: ReaderService, private cdRef: ChangeDetectorRef ){
    //Primero se ejecuta el constructor, luego el ngOnInit
  }

  //PARA LO DEL INICIO DE SESION
  // ocupan en el constructor private firebaseStuff : FirebaseStuffService, public userData: UserDataService, y el   user$ = this.firebaseStuff.currentUser$;

  user$ = this.firebaseStuff.currentUser$;

  ngOnInit(){
    this.recuperarDatosHome();
    this.filterByPrice();
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

  recuperarDatosHome(){
    this.array=this.placesService.places;
    if(this.array.length==0){
      this.placesService.retornar().subscribe({
        next: this.successRequestHome.bind(this),
        error:(err)=>{console.log(err)}
      });
    }else{
      //console.log("Si hay datos en el array, obteniendo directo del servicio");
    }
  }
  
  successRequestHome(data:any):void{
    this.array = data.AirbnbPlaces;
    this.filter = data.AirbnbPlaces;
    this.placesService.places = this.array;
  }

  filterByPrice(){
    this.filterService.filterCriteria.subscribe(criteria => {
      console.log(criteria);
      if(criteria != ""){
        this.array = [];
        this.filter.forEach(element => {
          if(parseInt(element.priceNight.replace(/\D/g, ''), 10) < parseInt(criteria)){
            console.log('precio',parseInt(element.priceNight.replace(/\D/g, ''), 10));
            this.array.push(element);
          }
        });
      }
    });
  }


  //Accesibilidad Web
  ngAfterViewChecked() {
    // Este método se llama después de que la vista del componente haya sido verificada por Angular
    this.updateContent();
    // Se llama a detectChanges para asegurar que los cambios se reflejen en la vista
    this.cdRef.detectChanges();
  }
  
  private updateContent() {
    // Selecciona todos los elementos con las clases 'p11', 'card-title', y 'card-text' en el documento
    const elements = Array.from(document.querySelectorAll('.p11, .card-title, .card-text'));
  
    // Mapea los elementos seleccionados para extraer su texto interno y eliminar espacios en blanco adicionales
    const content = elements
      .map(elem => {
        // Verifica que el elemento sea una instancia de HTMLElement
        if (elem instanceof HTMLElement) {
          // Devuelve el texto interno del elemento, eliminando espacios en blanco al principio y al final
          return elem.innerText.trim();
        }
        // Si no es un HTMLElement, devuelve una cadena vacía
        return '';
      })
      // Filtra los textos que no están vacíos
      .filter(text => text.length > 0)
      // Une los textos filtrados en una sola cadena, separándolos con un punto y un espacio
      .join('. ');
  
    // Actualiza la propiedad 'content' del servicio 'readerService' con la cadena generada
    this.readerService.content = content; 
  }
  
  
}

  


