import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { AdopcionesComponent } from './adopciones/adopciones.component';
import { DatosCitasComponent } from './datos-citas/datos-citas.component';
import { ReporteComponent } from './reporte/reporte.component';
import { BuscarComponent } from './buscar/buscar.component';
import { NosotrosComponent } from './nosotros/nosotros.component';
import { EquipoComponent } from './equipo/equipo.component';
import { AyudainfoComponent } from './ayudainfo/ayudainfo.component';


export const routes: Routes = [
    {path: 'home', component: HomeComponent},
    {path: 'adopciones', component: AdopcionesComponent},
    {path: 'citas/:index', component: DatosCitasComponent},
    {path: 'buscar', component: BuscarComponent},
    {path: 'reporte', component: ReporteComponent},
    {path: 'nosotros', component: NosotrosComponent},
    {path: 'equipo', component: EquipoComponent},
    {path: 'ayuda', component: AyudainfoComponent},
    {path: '**', pathMatch: 'full', redirectTo: 'home'}
];
