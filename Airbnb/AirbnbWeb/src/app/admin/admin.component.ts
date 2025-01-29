import { Component, OnInit } from '@angular/core';
import { Chart, ChartConfiguration, ChartType, ChartTypeRegistry } from 'chart.js/auto';
import { DarkBackService } from '../services/back/dark-back.service';
import { FirebaseStuffService } from '../services/firebaseService/firebase-stuff.service';
import { UserDataService } from '../services/firebaseService/user-data.service';
import { CommonModule } from '@angular/common';
import  User   from '../interfaces/user';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit{
    dark : boolean = false;
    background : string = "white";
    color : string = "black";
    url: string = "faiqd9Crpmg?si=AvhGc4-EmHppoD6q";
    user$ = this.firebaseStuff.currentUser$;
    averageDuration: number = 0;
    monthlyRevenue: number = 0;
    frequentClients: { email: string; count: number; }[] = [];
    appointmentsByDayOfWeek: { day: string; count: number; }[] = [];
    appointmentsChart: Chart<keyof ChartTypeRegistry, number[], string> | null = null;

    constructor(public darkBackService: DarkBackService, private firebaseStuff : FirebaseStuffService, public userData: UserDataService ){
      //Primero se ejecuta el constructor, luego el ngOnInit
    }
  
    ngOnInit(): void {
      // Consultas
      this.getAverageAppointmentDuration();
      this.getMonthlyRevenue();
      this.getFrequentClients();
      this.getAppointmentsByDayOfWeek();

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
  

    getAverageAppointmentDuration() {
      this.firebaseStuff.getAverageAppointmentDuration().subscribe(duration => {
        this.averageDuration = duration;
      });
    }

    getMonthlyRevenue() {
      this.firebaseStuff.getMonthlyRevenue().subscribe(revenue => {
        this.monthlyRevenue = revenue;
      });
    }

    getFrequentClients() {
      this.firebaseStuff.getFrequentClients().subscribe(clients => {
        this.frequentClients = clients;
      });
    }

    getAppointmentsByDayOfWeek() {
      this.firebaseStuff.getAppointmentsByDayOfWeek().subscribe(data => {
        this.appointmentsByDayOfWeek = data;
        this.renderChart(); // Llama a renderChart después de obtener los datos
      });
    }

    updateData() {
      this.getAverageAppointmentDuration();
      this.getMonthlyRevenue();
      this.getFrequentClients();
      this.getAppointmentsByDayOfWeek();
    }

    renderChart() {
      const ctx = document.getElementById('appointmentsChart') as HTMLCanvasElement;
  
      if (this.appointmentsChart) {
        this.appointmentsChart.destroy(); // Destruir la gráfica existente
      }
  
      const chartConfig: ChartConfiguration<keyof ChartTypeRegistry, number[], string> = {
        type: 'doughnut',
        data: {
          labels: this.appointmentsByDayOfWeek.map(d => d.day),
          datasets: [{
            label: 'Citas por Día de la Semana',
            data: this.appointmentsByDayOfWeek.map(d => d.count),
            backgroundColor: [
              'rgba(255, 99, 132, 0.2)',    // Lunes
              'rgba(54, 162, 235, 0.2)',    // Martes
              'rgba(255, 206, 86, 0.2)',    // Miércoles
              'rgba(75, 192, 192, 0.2)',    // Jueves
              'rgba(153, 102, 255, 0.2)',   // Viernes
              'rgba(255, 159, 64, 0.2)',    // Sábado
              'rgba(99, 255, 132, 0.2)'     // Domingo
            ],
            borderColor: [
              'rgba(255, 99, 132, 1)',      // Lunes
              'rgba(54, 162, 235, 1)',      // Martes
              'rgba(255, 206, 86, 1)',      // Miércoles
              'rgba(75, 192, 192, 1)',      // Jueves
              'rgba(153, 102, 255, 1)',     // Viernes
              'rgba(255, 159, 64, 1)',      // Sábado
              'rgba(99, 255, 132, 1)'       // Domingo
            ],
            borderWidth: 1
          }]
        }
      };
  
      this.appointmentsChart = new Chart(ctx, chartConfig);
    }
  
}
