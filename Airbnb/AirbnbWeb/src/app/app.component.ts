import { Component, HostListener } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ReporteReservacionesComponent } from './reporte-reservaciones/reporte-reservaciones.component';
import { TeamDataComponent } from './team-data/team-data.component';
import { HelpPageComponent } from './help-page/help-page.component';
import { PlaceDisplayComponent } from './place-display/place-display.component';
import { CommonModule, NgIf } from '@angular/common';
import { DarkBackService } from './services/back/dark-back.service';
import { FooterComponent } from './footer/footer.component';
import { FilterService } from './services/filter.service';
import { FormsModule } from '@angular/forms';
import { BotonDarkmodeComponent } from "./boton-darkmode/boton-darkmode.component";
import { UserDataService } from './services/firebaseService/user-data.service';
import { FirebaseStuffService } from './services/firebaseService/firebase-stuff.service';

import { ReaderService } from './services/reader.service';

import { MatDialog } from '@angular/material/dialog';
import { SignupComponent } from './signup/signup.component';
import { StantardComponent } from './login/stantard/stantard.component';
import { ContactComponent } from './contact/contact.component';
import { SpinnerComponent } from './spinner/spinner.component';
import { QRCodeModule } from 'angularx-qrcode';


@Component({
    selector: 'app-root',
    standalone: true,
    templateUrl: './app.component.html',
    styleUrl: './app.component.css',

    imports: [RouterOutlet, HomeComponent, ReporteReservacionesComponent, TeamDataComponent, PlaceDisplayComponent, RouterModule, CommonModule, FooterComponent, FormsModule, BotonDarkmodeComponent, ContactComponent, SpinnerComponent],

})


export class AppComponent {
  title = 'AirbnbWeb';
  dark : boolean = false;
  background : string = "white";
  color : string = "black";
  activeLink: string = 'home'; 
  clase: string = "fa-solid fa-sun";
  shadow: string = "0 2px 4px 0 rgba(0,0,0,0.2)";
  criteria: string = "";
  isReading: boolean = false;
  isPause: boolean = false;


  constructor(public dialog : MatDialog, public darkBackService: DarkBackService, private filterService: FilterService, private firebaseStuff : FirebaseStuffService, public userData: UserDataService, private readerService: ReaderService){

    
  }

  user$ = this.firebaseStuff.currentUser$;
  menuOpen = false; // Variable para controlar el estado del menú de usuario

  toggleMenu() {
    this.menuOpen = !this.menuOpen; // Cambiar el estado del menú
  }

  @HostListener('document:click', ['$event'])  // Para el dropdown hamburger
  onClick(event: MouseEvent) {
    const menuIconElement = document.querySelector('.menuIcon') as HTMLElement;
    if (menuIconElement && !menuIconElement.contains(event.target as Node)) {
      this.menuOpen = false;
    }
  }




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

    //Accesibilidad web, para saber si el lector de pantalla esta activo o en pause
    this.readerService.isReading$.subscribe(value => {
      this.isReading = value;
    });

     this.readerService.isPause$.subscribe(value => {
      this.isPause = value;
    });
  }

  

  change(){
    this.darkBackService.setDark(!this.dark);
  }

  setActiveLink(link:string){
    this.activeLink=link;
  }

  filterByPrice(){
    this.filterService.filterCriteria.next(this.criteria);
  }

  manejarClicEnBoton(): void {
    this.darkBackService.setDark(!this.dark);
  }

  logout(){
    this.firebaseStuff.logout().subscribe({
      next: () => {
        console.log('Logged out');
      },
      error: (err) => {
        console.log('Error:', err);
      }
    });
  }



  //Accesibilidad web metodos
  toggleHighContrast() {
    document.body.classList.toggle('high-contrast');
  }
  
  toggleInvertColors() {
    document.body.classList.toggle('invert-colors');
  }
  
  textSizeLevel: number = 0;
  
  toggleTextSize() {
    this.textSizeLevel = (this.textSizeLevel + 1) % 4; // Ciclar entre los niveles 0, 1, 2, 3
    document.body.classList.remove('small-text', 'medium-text', 'large-text');
  
    switch (this.textSizeLevel) {
      case 1:
        document.body.classList.add('small-text');
        break;
      case 2:
        document.body.classList.add('medium-text');
        break;
      case 3:
        document.body.classList.add('large-text');
        break;
      }
    }
  
  
  toggleLargeCursor() {
    document.body.classList.toggle('large-cursor');
  }
  
  startReading() {
    this.readerService.startReading(this.readerService.content);
  }
  
  pauseReading() {
    this.readerService.pauseReading();
  }
  
  resumeReading() {
    this.readerService.resumeReading();
  }
  
  stopReading() {
    this.readerService.stopReading();
  }


  openSignup(): void {
    const dialogRef = this.dialog.open(SignupComponent, {
      maxWidth: '90vw',
      width: '30%',
      maxHeight: '90vh',
      height: 'auto',
      panelClass: 'signup',
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

  openLogin(): void {
    const dialogRef = this.dialog.open( StantardComponent, {
      maxWidth: '90vw',
      width: '30%',
      maxHeight: '90vh',
      height: 'auto',
      panelClass: 'login',
      autoFocus: false,
    });

    dialogRef.afterClosed().subscribe(result => {
      console.log('The dialog was closed');
    });
  }

}

