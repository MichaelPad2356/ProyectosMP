import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { take } from 'rxjs';
import { Places } from '../interfaces/places';

@Injectable({
  providedIn: 'root'
})
export class PlacesService {


  //urlAPI:string="https://robertapi.free.beeceptor.com/places";
  urlAPI:string="../../assets/JSON/places.json";
  places : Places[] = [];

  constructor(private http: HttpClient) {
    
  
  }
  
  retornar(){
    console.log("Se ejecuto el retornar de PlacesService");
    return this.http.get(this.urlAPI).pipe(take(1));
  }
}

@Injectable({
  providedIn: 'root'
})

export class ExperienciasService {


  // urlAPI:string="https://robertapi.free.beeceptor.com/exp";
  urlAPI:string="../../assets/JSON/experiences.json";
  constructor(private http: HttpClient) { }

  retornar(){
    return this.http.get(this.urlAPI).pipe(take(1));
  }
}

