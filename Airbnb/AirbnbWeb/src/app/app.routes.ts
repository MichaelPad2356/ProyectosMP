import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ReporteReservacionesComponent } from './reporte-reservaciones/reporte-reservaciones.component';
import { TeamDataComponent } from './team-data/team-data.component';
import { PlaceDisplayComponent } from './place-display/place-display.component';
import { ExperienciasComponent } from './experiencias/experiencias.component';
import { CheckoutFormComponent } from './checkout-form/checkout-form.component';
import { SignupComponent } from './signup/signup.component';
import { PhoneComponent } from './login/phone/phone.component';
import { StantardComponent } from './login/stantard/stantard.component';
import { AdminComponent } from './admin/admin.component';
import { ContactComponent } from './contact/contact.component';
import { HelpPageComponent } from './help-page/help-page.component';
import { LoadingGuard } from './loading.guard';

export const routes: Routes = [
    {path: '', redirectTo: '/home', pathMatch: 'full'},
    {path: 'home', component: HomeComponent},
    {path: 'reporte-reservaciones', component: ReporteReservacionesComponent, canActivate: [LoadingGuard]},
    {path: 'team-data', component: TeamDataComponent},
    {path: 'place-display/:id', component: PlaceDisplayComponent},
    {path: 'experiencias', component: ExperienciasComponent},
    {path: 'checkout-form/:id', component: CheckoutFormComponent},
    {path: 'login', component: StantardComponent},
    {path: 'signup', component: SignupComponent},
    {path: "phone", component: PhoneComponent},
    {path: "admin", component: AdminComponent},
    {path: 'contact', component: ContactComponent},
    {path: 'help-page', component: HelpPageComponent},
];
