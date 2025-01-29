import { Injectable } from '@angular/core';
import { Auth, authState, signInWithEmailAndPassword  } from '@angular/fire/auth';
import { Router } from '@angular/router';
import { from, map, switchMap } from 'rxjs';
import { Firestore,  collection, addDoc, collectionData, doc, deleteDoc, Timestamp, getDoc } from '@angular/fire/firestore';
import  User   from '../../interfaces/user';
import { Observable } from 'rxjs';
import { ReservaFB } from '../../interfaces/reservasFB';
import { where, query } from '@firebase/firestore';

@Injectable({
  providedIn: 'root'
})
export class FirebaseStuffService {

  constructor( private auth: Auth, private router : Router, private firestore: Firestore) { }

  currentUser$ = authState(this.auth);

  login(username: string, password: string) {
    return from(signInWithEmailAndPassword(this.auth, username, password)); //convierte la promesa en un observable
  }

  logout(){
    
    return from(this.auth.signOut());
  }

  addUser( user : User){
    const userRef = collection(this.firestore, 'Users');
    return addDoc(userRef, user);
  }

  getUser() : Observable<User[]> {
    const userRef = collection(this.firestore, 'Users');
    return collectionData(userRef, {idField: 'id'}) as Observable<User[]>;
  }

  addReserva( reserva : ReservaFB){
    const reservaRef = collection(this.firestore, 'Reservas');
    return addDoc(reservaRef, reserva);
  }

  getReservas() : Observable<ReservaFB[]> {
    const reservaRef = collection(this.firestore, 'Reservas');
    return collectionData(reservaRef, {idField: 'id'}) as Observable<ReservaFB[]>;
  }


  getReservationsByUserId(userId: string): Observable<ReservaFB[]> {
    const reservasRef = collection(this.firestore, 'Reservas');
    const q = query(reservasRef, where('userID', '==', userId));
    return collectionData(q, { idField: 'id' }) as Observable<ReservaFB[]>;
  }

  deleteReserva(reserva: ReservaFB): Promise<void> {
    const reservationDocRef = doc(this.firestore, `Reservas/${reserva.id}` );
    console.log(reserva.userID);
    return deleteDoc(reservationDocRef);
  }

  timestampToDate(timestamp: Timestamp): Date{
    return timestamp.toDate();
  }

  // Duración promedio de la cita
  getAverageAppointmentDuration(): Observable<number> {
    return this.getReservas().pipe(
      map((reservas: ReservaFB[]) => {
        const totalDuration = reservas.reduce((sum, reserva) => {
          const days = parseInt(reserva.dias.replace(' dias', '').trim(), 10);
          return sum + days;
        }, 0);
        return totalDuration / reservas.length;
      })
    );
  }

  // Informe de ingresos mensuales desde la fecha actual hasta un mes atrás
  getMonthlyRevenue(): Observable<number> {
    const today = new Date();
    const oneMonthAgo = new Date(today);
    oneMonthAgo.setMonth(today.getMonth() - 1);

    return this.getReservas().pipe(
      map((reservas: ReservaFB[]) => {
        return reservas
          .filter(reserva => {
            const reservaDate = this.timestampToDate(reserva.fecha);
            console.log(`Reserva Fecha: ${reservaDate}, Rango: ${oneMonthAgo} - ${today}`); // Debug: Log fecha de la reserva
            return reservaDate >= oneMonthAgo && reservaDate <= today;
          })
          .reduce((sum, reserva) => {
            console.log(`Reserva Precio: ${reserva.precioTotal}`); // Debug: Log precio de la reserva
            return sum + (isNaN(reserva.precioTotal) ? 0 : reserva.precioTotal);
          }, 0);
      })
    );
  }

  
  // Informe de clientes frecuentes (limitar a los primeros 4)
  getFrequentClients(): Observable<{ email: string, count: number }[]> {
    return this.getReservas().pipe(
      switchMap((reservas: ReservaFB[]) => {
        const clientCounts = reservas.reduce((acc, reserva) => {
          acc[reserva.userID] = (acc[reserva.userID] || 0) + 1;
          return acc;
        }, {} as { [key: string]: number });

        const topClients = Object.entries(clientCounts)
          .map(([userID, count]) => ({ userID, count }))
          .sort((a, b) => b.count - a.count)
          .slice(0, 4); // Limitar a los primeros 4

        return this.getUser().pipe(
          map((users: User[]) => {
            console.log('Users:', users); // Debug: Log all users
            return topClients.map(client => {
              const user = users.find(u => u.userID === client.userID);
              console.log('User:', user); // Debug: Log user for each top client
              return { email: user?.email || 'Desconocido', count: client.count };
            });
          })
        );
      })
    );
  }

  // Citas por día de la semana
  getAppointmentsByDayOfWeek(): Observable<{ day: string, count: number }[]> {
    return this.getReservas().pipe(
      map((reservas: ReservaFB[]) => {
        const dayCounts = reservas.reduce((acc, reserva) => {
          const reservaDate = this.timestampToDate(reserva.fecha);
          const dayOfWeek = reservaDate.toLocaleDateString('es-ES', { weekday: 'long' });
          acc[dayOfWeek] = (acc[dayOfWeek] || 0) + 1;
          return acc;
        }, {} as { [key: string]: number });

        return Object.entries(dayCounts)
          .map(([day, count]) => ({ day, count }))
          .sort((a, b) => ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'].indexOf(a.day) - ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'].indexOf(b.day));
      })
    );
  }

}
