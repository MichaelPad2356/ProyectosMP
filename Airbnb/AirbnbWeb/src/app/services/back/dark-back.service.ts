import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class DarkBackService {

  constructor() { 
    if(localStorage.getItem('dark') === null){
      localStorage.setItem('dark', 'false');
    }else{
      this.bool = localStorage.getItem('dark') === 'true';
      this.darkSubject.next(this.bool);
    }

  }
  bool : boolean = false;
  private darkSubject = new BehaviorSubject<boolean>(false);
  dark$ = this.darkSubject.asObservable();

  setDark(dark: boolean) {
    this.darkSubject.next(dark);
    this.bool = dark;
    localStorage.setItem('dark', dark.toString());
  }
}
