import { Injectable } from '@angular/core';
import { animPeGa } from '../animales';
import { ANIMALES } from '../animalesRefugio';

@Injectable({
  providedIn: 'root'
})
export class AdoptaService {

  constructor() { }

  private anim: animPeGa[] = ANIMALES;

  getAnimales(): animPeGa[]{
    return this.anim;
  }

  getUnAnimal(posicion: number): animPeGa{
    return this.anim[posicion];
  }

}
