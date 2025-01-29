import { Component, Input } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { Places } from '../interfaces/places';
import { PlacesService } from '../services/places.service';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { PriceBoxComponent } from '../price-box/price-box.component';
import { CommonModule } from '@angular/common';
import { DarkBackService } from '../services/back/dark-back.service';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-place-display',
  standalone: true,
  imports: [RouterModule, PriceBoxComponent, CommonModule, TitleCasePipe],
  templateUrl: './place-display.component.html',
  styleUrl: './place-display.component.css'
})
export class PlaceDisplayComponent {
  
  place : Places = {} as Places;
  places : Places[] = [];
  id : number = 0;
  priceNightNumber : number = 0;
  array : string [] = ["fa-solid fa-wifi"];
  dark : boolean = false;
  background : string = "white";
  color : string = "black";
  
  

  constructor( public route: ActivatedRoute, public placesService: PlacesService, private sanitizer: DomSanitizer, private router: Router, public darkBackService: DarkBackService){
    
    
  }

  ngOnInit(){
    this.route.params.subscribe(params => {
      this.fillPlace(params["id"]);
      this.place = this.placesService.places[params["id"]]; 
      console.log("just got the data from the server - displayplace")
      this.otherValue();

    });
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

  ngAfterViewInit(){
    this.otherValue();
  }

  otherValue(){
    this.priceNightNumber = parseFloat(this.place.priceNight.replace(/[^0-9.-]+/g,""));
    console.log("otherValues placedisplay"+this.priceNightNumber );
  }
  
  fillPlace(id: number){
      this.id = id;
      if(this.placesService.places.length==0){
        console.log("Solicitud a servidor placeDisplay");
        this.placesService.retornar().subscribe({
          next: this.successRequest.bind(this),
          error:(err)=>{console.log(err)}
        });
      }else{
        console.log("No se hizo solicitud al servidor, placeDisplay");
        this.place=this.placesService.places[id];
      }
    
    
    
  }

  successRequest(data:any):void{
    this.places = data.AirbnbPlaces;
    this.placesService.places = this.places;
    this.place = this.places[this.id];
    this.priceNightNumber = parseFloat(this.place.priceNight.replace(/[^0-9.-]+/g,""));

    
  }

  getSafeHtml(googleMapsEmbeded: string): SafeHtml {
    
    return this.sanitizer.bypassSecurityTrustHtml(googleMapsEmbeded);
  }

  ngAfterViewChecked(): void {
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe(() => {
      setTimeout(() => {
        window.scrollTo(0, 0);
        console.log("Scrolling to top placeDisplay");
      }, 100);
    });
  }

  

  

}

