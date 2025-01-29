import { Component, EventEmitter, Output } from '@angular/core';
import { DarkBackService } from '../services/back/dark-back.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-boton-darkmode',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './boton-darkmode.component.html',
  styleUrl: './boton-darkmode.component.css'
})
export class BotonDarkmodeComponent {

  @Output() clicEnBoton: EventEmitter<void> = new EventEmitter<void>();

  dark : boolean = false;
  background : string = "white";
  color : string = "black";
  activeLink: string = 'home'; 
  clase: string = "fa-solid fa-sun";
  shadow: string = "0 2px 4px 0 rgba(0,0,0,0.2)";
  criteria: string = "";

  constructor(public darkBackService: DarkBackService) { }


  ngOnInit() {
    this.darkBackService.dark$.subscribe(dark => {
      this.dark = dark;
      if(this.dark){
        this.background = "black";
        this.color = "white";
        this.clase= "fa-solid fa-sun";
        this.shadow = "0px 2px 4px 0px rgba(255,255,255,0.2)";
      }else{
        this.background = "white";
        this.color = "black";
        this.clase= "fa-solid fa-moon";
        this.shadow = "0px 2px 4px 0px rgba(0,0,0,0.2)";
      }
    });
  }

  onClick():void{
    this.clicEnBoton.emit();
  }

}
