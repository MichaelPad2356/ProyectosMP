import { Component } from '@angular/core';
import { DarkBackService } from '../services/back/dark-back.service';
import { PlacesService } from '../services/places.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-help-page',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './help-page.component.html',
  styleUrl: './help-page.component.css'
})
export class HelpPageComponent {
  dark : boolean = false;
  background : string = "white";
  color : string = "black";

  constructor(public placesService: PlacesService, public darkBackService: DarkBackService){
    //Primero se ejecuta el constructor, luego el ngOnInit
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
