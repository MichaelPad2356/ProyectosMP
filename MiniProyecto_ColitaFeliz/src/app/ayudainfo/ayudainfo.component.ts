import { Component } from '@angular/core';
import { AdopcionComponent } from '../adopcion/adopcion.component';
import { DonacionComponent } from '../donacion/donacion.component';
import { VoluntariosComponent } from '../voluntarios/voluntarios.component';

@Component({
  selector: 'app-ayudainfo',
  standalone: true,
  imports: [AdopcionComponent,DonacionComponent,VoluntariosComponent],
  templateUrl: './ayudainfo.component.html',
  styleUrl: './ayudainfo.component.css'
})
export class AyudainfoComponent {

}
